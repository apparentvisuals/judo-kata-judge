import { format } from 'date-fns';
import { nanoid } from 'nanoid';

import { createReport, isDev, numberOfTechniques } from '~/server/utils';

const tKey = isDev() ? 'tournament-dev' : 'tournament';

/**
 * {
 *   id: string
 *   name: string
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

  getMat(matNumber) {
    const mat = this.#tournament.mats[matNumber];
    // mat.startTime = mat.startTime || format(new Date(), 'HH:mm');
    return mat;
  }

  getMatch(matNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    for (const group of mat.groups) {
      for (const [index, match] of group.matches.entries()) {
        if (!match.completed) {
          return { match, index };
        }
      }
    }
    return {};
  }

  getJudgeNumber(matNumber, judge) {
    const mat = this.getMat(matNumber);
    const judgeIndex = mat.judges.indexOf(judge);
    return judgeIndex + 1;
  }

  async createMat() {
    this.#tournament.mats.push({ groups: [] });
  }

  async deleteMat(index) {
    this.#tournament.mats.splice(index, 1);
  }

  async createGroup(mat, { name, kata, numberOfJudges }) {
    this.#tournament.mats[mat].groups.push({
      name,
      kata,
      numberOfJudges,
      matches: []
    });
  }

  async deleteGroup(mat, group) {
    this.#tournament.mats[mat].groups.splice(group, 1);
  }

  async createMatch(matNumber, groupNumber, data) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const matches = group.matches;
    // const numberOfJudges = data.numberOfJudges = data.numberOfJudges || group.numberOfJudges || 5;
    const match = {
      ...data,
      completed: false,
    };
    // for (let ii = 0; ii < numberOfJudges; ii++) {
    //   const scores = _getKataScoreSet(data.kata);
    //   match.judges.push({
    //     number: ii,
    //     name: '',
    //     scores,
    //     total: numberOfTechniques(data.kata) * 10,
    //     majorIndex: Array(scores.length).fill(0),
    //   })
    // }
    // match.results = createReport(match);
    matches.push(match);
    return match;
  }

  async deleteMatch(matNumber, groupNumber, match) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const matches = group.matches;
    matches.splice(match, 1);
  }

  get id() {
    return this.#id;
  }

  get data() {
    return { ...this.#tournament, id: this.#id };
  }

  async save() {
    await useStorage().setItem(`${tKey}:${this.#id}`, this.#tournament);
  }

  replace(tournament) {
    this.#tournament = tournament;
  }

  static async getAll() {
    const tournamentsIds = await useStorage(tKey).getKeys();
    const loadTournaments = tournamentsIds.map((id) => {
      return (async () => {
        const tournament = await Tournament.get(id);
        return { id: tournament.data.id, name: tournament.data.name };
      })();
    });
    const tournaments = await Promise.all(loadTournaments);
    return tournaments;
  }

  static async get(id) {
    const tournament = await useStorage().getItem(`${tKey}:${id}`);
    if (!tournament) {
      const error = new Error('no such tournament');
      throw error;
    }
    return new Tournament(id, tournament);
  }

  static async create({ name = 'Tournament 1', showJudgeTotals = true }) {
    const id = nanoid(6);
    const tournamentData = {
      name,
      showJudgeTotals,
      mats: [],
    };
    const tournament = new Tournament(id, tournamentData);
    await tournament.save();
    return tournament;
  }
}

function _getKataScoreSet(kata) {
  return _createScoreSet(numberOfTechniques(kata));
}

function _createScoreSet(techniquesCount) {
  return new Array(techniquesCount).fill().map(() => _defaultScore());
}

function _defaultScore() {
  return { value: 10, deductions: ':::::' };
}

function _createMatInfo(mat) {
  return {
    number: mat,
    numberOfJudges: 5,
    matches: [],
    judges: Array(5).fill().map(() => ''),
    judgeCodes: Array(5).fill().map(() => nanoid(4)),
  }
}