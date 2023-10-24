import { nanoid } from 'nanoid';
import { pick } from 'lodash-es';

import { isDev } from '~/server/utils';

const key = isDev() ? 'tournament-dev' : 'tournament';

/**
 * {
 *   id: string
 *   name: string
 *   org: string
 *   numberOfMats: number
 *   showJudgeTotals: boolean
 *   mats: [{
 *     groups: [{
 *       numberOfJudges: number
 *       startTime: string
 *       matches: [{
 *         kata: string
 *         tori: string
 *         uke: string
 *         numberOfJudges: number
 *         completed: boolean
 *         judges: [{
 *           id: string
 *           scores: []
 *         }]
 *         results: []
 *       }]
 *     }]
 *   }]
 * }
 */
export default class Tournament {
  #id;
  #tournament;
  constructor(id, data) {
    this.#id = id;
    this.#tournament = data;
  }

  static async getAll() {
    const tournamentsIds = await useStorage(key).getKeys();
    const loadTournaments = tournamentsIds.map((id) => {
      return (async () => {
        const tournament = await Tournament.get(id);
        return pick(tournament.data, ['id', 'name', 'org', 'showJudgeTotals']);
      })();
    });
    const tournaments = await Promise.all(loadTournaments);
    return tournaments;
  }

  static async get(id) {
    const tournament = await useStorage(key).getItem(id);
    if (tournament) {
      return new Tournament(id, tournament);
    }
  }

  static async create({ name = 'Tournament 1', org, showJudgeTotals = true }) {
    const id = nanoid(6);
    const tournamentData = {
      name,
      org,
      showJudgeTotals,
      mats: [],
    };
    const tournament = new Tournament(id, tournamentData);
    await tournament.save();
    return tournament;
  }

  static async remove(id) {
    await useStorage(key).removeItem(id);
  }

  getMat(matNumber) {
    const mat = this.#tournament.mats[matNumber];
    return mat;
  }

  async createMat() {
    this.#tournament.mats.push({ groups: [] });
  }

  async deleteMat(index) {
    this.#tournament.mats.splice(index, 1);
  }

  async createGroup(mat, { name, kata, numberOfJudges, startTime }) {
    this.#tournament.mats[mat].groups.push({
      name,
      kata,
      numberOfJudges,
      startTime,
      matches: []
    });
  }

  async updateGroup(matNumber, groupNumber, { name, kata, numberOfJudges, startTime }) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    group.name = name;
    group.kata = kata;
    group.numberOfJudges = numberOfJudges;
    group.startTime = startTime;
  }

  async deleteGroup(mat, group) {
    this.#tournament.mats[mat].groups.splice(group, 1);
  }

  getMatch(matNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    for (const [groupIndex, group] of mat.groups.entries()) {
      for (const [index, match] of group.matches.entries()) {
        if (!match.completed) {
          const combinedMatch = { kata: group.kata, numberOfJudges: group.numberOfJudges, uke: match.uke, tori: match.tori, scores: match.scores || Array(group.numberOfJudges).fill({}) };
          return { match: combinedMatch, index, groupIndex };
        }
      }
    }
    return {};
  }

  async createMatch(matNumber, groupNumber, { tori, toriId, uke, ukeId }) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const matches = group.matches;
    const match = {
      tori,
      toriId,
      uke,
      ukeId,
      completed: false,
    };
    matches.push(match);
    return match;
  }

  async updateMatch(matNumber, groupNumber, matchNumber, { tori, toriId, uke, ukeId, completed, scores, results }) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const match = group.matches[matchNumber];
    if (!match) {
      return;
    }
    if (match.completed) {
      return;
    }
    if (tori != null) {
      match.tori = tori;
    }
    match.toriId = toriId;
    if (uke != null) {
      match.uke = uke;
    }
    match.ukeId = ukeId;
    if (completed != null) {
      match.completed = completed;
    }
    if (scores != null) {
      match.scores = scores;
    }
    if (results != null) {
      match.results = results;
    }
  }

  async deleteMatch(matNumber, groupNumber, matchNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const matches = group.matches;
    matches.splice(matchNumber, 1);
  }

  get id() {
    return this.#id;
  }

  get data() {
    return { ...this.#tournament, id: this.#id };
  }

  async save() {
    await useStorage(key).setItem(this.#id, this.#tournament);
  }

  replace(tournament) {
    this.#tournament.name = tournament.name;
    this.#tournament.org = tournament.org;
    this.#tournament.showJudgeTotals = tournament.showJudgeTotals;
  }
}

function _defaultScore() {
  return { value: 10, deductions: ':::::' };
}
