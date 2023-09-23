import { format } from 'date-fns';
import { nanoid } from 'nanoid';

import { createReport, isDev, numberOfTechniques } from '../utils';

const tKey = isDev() ? 'tournament-dev' : 'tournament';

export default class Tournament {
  #id;
  #tournament;
  constructor(id, data) {
    this.#id = id;
    this.#tournament = data;
  }

  getMat(matNumber) {
    const numberOfMats = this.#tournament.numberOfMats;
    if (matNumber >= numberOfMats) {
      return;
    }
    const mat = this.#tournament.mats[matNumber];
    mat.startTime = mat.startTime || format(new Date(), 'HH:mm');
    return mat;
  }

  getMatch(matNumber) {
    const mat = this.getMat(matNumber);
    if (!mat) {
      return;
    }
    return mat.matches.find((match) => !match.completed);
  }

  getJudgeNumber(matNumber, judge) {
    const mat = this.getMat(matNumber);
    const judgeIndex = mat.judges.indexOf(judge);
    return judgeIndex + 1;
  }

  async updateMat(matNumber, numberOfJudges, startTime) {
    const mat = this.getMat(matNumber);
    if (!mat) {
      return;
    }
    mat.numberOfJudges = numberOfJudges;
    mat.startTime = startTime;
    mat.judges = Array(5).fill().map(() => '');
    mat.judgeCodes = Array(5).fill().map(() => nanoid(4));
    switch (numberOfJudges) {
      case 5:
        break;
      case 4:
        mat.judgeCodes[0] = '-';
        break;
      case 3:
        mat.judgeCodes[0] = mat.judgeCodes[4] = '-';
        break;
      case 2:
        mat.judgeCodes[0] = mat.judgeCodes[1] = mat.judgeCodes[4] = '-';
        break;
      case 1:
        mat.judgeCodes[0] = mat.judgeCodes[1] = mat.judgeCodes[3] = mat.judgeCodes[4] = '-';
        break;
    }
    return mat;
  }

  async addMatch(matNumber, kata, tori, uke, numberOfJudges) {
    const mat = this.getMat(matNumber);
    if (!mat) {
      return;
    }
    const matches = mat.matches;
    numberOfJudges = numberOfJudges || mat.numberOfJudges;
    const match = {
      number: matches.length,
      kata,
      tori,
      uke,
      numberOfJudges,
      completed: false,
      judges: [],
    };
    for (let ii = 0; ii < numberOfJudges; ii++) {
      const scores = _getKataScoreSet(kata);
      match.judges.push({
        number: ii,
        name: '',
        scores,
        total: numberOfTechniques(kata) * 10,
        majorIndex: Array(scores.length).fill(0),
      })
    }
    match.results = createReport(match);
    matches.push(match);
    return match;
  }

  async deleteMatch(matNumber, matchNumber) {
    const mat = this.getMat(matNumber);
    if (!mat) {
      return;
    }
    const matches = mat.matches;
    matches.splice(matchNumber, 1);
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

  static async create({ name = 'Tournament 1', numberOfMats = 1 }) {
    const id = nanoid(6);
    const tournamentData = {
      name,
      numberOfMats,
      mats: Array(numberOfMats).fill(0).map((v, index) => _createMatInfo(index)),
    };
    const tournament = new Tournament(id, tournamentData);
    await tournament.save();
    return tournament;
    // return { id, ...tournamentData };
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
