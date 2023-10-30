import { nanoid } from 'nanoid';
import { pick } from 'lodash-es';

import { createReport, isDev } from '~/server/utils';

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

  createMat() {
    this.#tournament.mats.push({ groups: [] });
  }

  deleteMat(index) {
    this.#tournament.mats.splice(index, 1);
  }

  createGroup(mat, { name, kata, numberOfJudges, startTime, disableDivideByHalf, disableForgotten, disableMajor }) {
    const group = {
      name,
      kata,
      numberOfJudges,
      matches: []
    }
    if (startTime) {
      group.startTime = startTime;
    }
    if (disableDivideByHalf != null) {
      group.disableDivideByHalf = disableDivideByHalf;
    }
    if (disableForgotten != null) {
      group.disableForgotten = disableForgotten;
    }
    if (disableMajor != null) {
      group.disableMajor = disableMajor;
    }
    this.#tournament.mats[mat].groups.push(group);
  }

  updateGroup(matNumber, groupNumber, { name, kata, numberOfJudges, startTime, disableDivideByHalf, disableForgotten, disableMajor }) {
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
    if (group.numberOfJudges) {
      group.numberOfJudges = parseInt(numberOfJudges);
    }
    group.startTime = startTime;
    if (disableDivideByHalf != null) {
      group.disableDivideByHalf = disableDivideByHalf;
    }
    if (disableForgotten != null) {
      group.disableForgotten = disableForgotten;
    }
    if (disableMajor != null) {
      group.disableMajor = disableMajor;
    }
  }

  deleteGroup(mat, group) {
    this.#tournament.mats[mat].groups.splice(group, 1);
  }

  getMatch(matNumber, groupNumber, matchNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const match = group.matches[matchNumber];
    return { kata: group.kata, numberOfJudges: group.numberOfJudges, uke: match.uke, tori: match.tori, scores: match.scores, results: createReport(group, match) };
  }

  getNextMatch(matNumber) {
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

  createMatch(matNumber, groupNumber, { tori, toriId, uke, ukeId }) {
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

  updateMatch(matNumber, groupNumber, matchNumber, { tori, toriId, uke, ukeId, completed, scores }) {
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
    return match;
  }

  deleteMatch(matNumber, groupNumber, matchNumber) {
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
