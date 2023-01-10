
import { nanoid } from 'nanoid';

import Clients from './clients';
import { createReport, numberOfTechniques } from './utils';

const clients = new Map();

class Tournament {
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
    return this.#tournament.mats[matNumber];
  }

  getMatch(matNumber) {
    const mat = this.getMat(matNumber);
    if (!mat) {
      return;
    }
    return mat.matches.find((match) => !match.completed);
  }

  async updateMat(matNumber, numberOfJudges) {
    const mat = this.getMat(matNumber);
    if (!mat) {
      return;
    }
    mat.numberOfJudges = numberOfJudges;
    // const matInfo = {
    //   number: mats.length,
    //   numberOfJudges,
    //   matches: [],
    //   clients: new Clients(),
    //   reportClients: new Clients(),
    //   summaryClients: new Clients(),
    // }
    // tournament.mats.push(matInfo);
    await this.save();
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

  get data() {
    return this.#tournament;
  }

  async save() {
    await useStorage().setItem(`kata:${this.#id}`, this.#tournament);
  }
}

class DB {
  async createTournament(name = 'Tournament 1', numberOfMats = 1) {
    const id = nanoid(6);
    const tournamentData = {
      id,
      name,
      numberOfMats,
      mats: Array(numberOfMats).fill(0).map((v, index) => _createMatInfo(index)),
    };
    const tournament = new Tournament(id, tournamentData);
    await tournament.save();
    return { id, ...tournamentData };
  }

  async tournament(id) {
    const tournament = await useStorage().getItem(`kata:${id}`);
    if (!tournament) {
      const error = new Error('no such tournament');
      throw error;
    }
    return new Tournament(id, tournament);
  }

  /**
   * 
   * @param {string} key format {tournamentCode}-{matNumber}
   */
  clients(key) {
    if (!clients.has(key)) {
      clients.set(key, {
        match: new Clients(),
        report: new Clients(),
        summary: new Clients(),
      });
    }
    return clients.get(key);
  }

  async updateMat(id, mat, numberOfJudges) {
    const tournament = await this.tournament(id);
    return tournament.updateMat(mat, numberOfJudges);
  }

  async addMatch(id, mat, kata, tori, uke, numberOfJudges) {
    const tournament = await this.tournament(id);
    tournament.addMatch(mat, kata, tori, uke, numberOfJudges);
    await tournament.save();
    return tournament.data;
  }

  async getTournament(id) {
    const tournament = await this.tournament(id);
    return tournament.data;
  }

  async getMat(id, mat) {
    const tournament = await this.tournament(id);
    return tournament.getMat(mat);
  }

  async getMatch(id, mat) {
    const tournament = await this.tournament(id);
    return tournament.getMatch(mat);
  }
}

function _getKataScoreSet(kata) {
  return _createScoreSet(numberOfTechniques(kata));
}

function _createScoreSet(techniquesCount) {
  return new Array(techniquesCount).fill().map(() => _defaultScore());
}

function _createMatInfo(mat) {
  return {
    number: mat,
    numberOfJudges: 5,
    matches: [],
    // clients: new Clients(),
    // reportClients: new Clients(),
    // summaryClients: new Clients(),
  }
}
function _defaultScore() {
  return { value: 10, deductions: ':::::' };
}

export default new DB();
