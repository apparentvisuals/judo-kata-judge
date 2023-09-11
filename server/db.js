
import { nanoid } from 'nanoid';

import Clients from './clients';
import { createReport, numberOfTechniques } from './utils';
import { format } from 'date-fns';

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
    await useStorage().setItem(`tournament:${this.#id}`, this.#tournament);
  }

  replace(tournament) {
    this.#tournament = tournament;
  }
}

class DB {
  async createTournament({ name = 'Tournament 1', numberOfMats = 1 }) {
    const id = nanoid(6);
    const tournamentData = {
      name,
      numberOfMats,
      mats: Array(numberOfMats).fill(0).map((v, index) => _createMatInfo(index)),
    };
    const tournament = new Tournament(id, tournamentData);
    await tournament.save();
    return { id, ...tournamentData };
  }

  async createJudge(data) {
    const id = nanoid(6);
    const judge = data;
    await useStorage('judge').setItem(id, judge);
    return { id, ...judge };
  }

  async createAthlete(data) {
    const id = nanoid(6);
    const athlete = data;
    await useStorage('athlete').setItem(id, athlete);
    return { id, ...athlete };
  }

  async tournament(id) {
    const tournament = await useStorage().getItem(`tournament:${id}`);
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

  async getAllAthletes() {
    const athleteIds = await useStorage('athlete').getKeys();
    const loadAthletes = athleteIds.map((id) => {
      return (async () => {
        const athlete = await useStorage('athlete').getItem(id);
        return { id, name: athlete.name, region: athlete.region, rank: athlete.rank };
      })();
    });
    const athletes = await Promise.all(loadAthletes);
    return athletes;
  }

  async getAllJudges() {
    const judgeIds = await useStorage('judge').getKeys();
    const loadJudges = judgeIds.map((id) => {
      return (async () => {
        const judge = await useStorage('judge').getItem(id);
        return { id, name: judge.name, region: judge.region, rank: judge.rank };
      })();
    });
    const judges = await Promise.all(loadJudges);
    return judges;
  }

  async getAllTournaments() {
    const tournamentsIds = await useStorage('tournament').getKeys();
    const loadTournaments = tournamentsIds.map((id) => {
      return (async () => {
        const tournament = await this.tournament(id);
        return { id: tournament.data.id, name: tournament.data.name };
      })();
    });
    const tournaments = await Promise.all(loadTournaments);
    return tournaments;
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
    judges: Array(5).fill().map(() => ''),
    judgeCodes: Array(5).fill().map(() => nanoid(4)),
  }
}
function _defaultScore() {
  return { value: 10, deductions: ':::::' };
}

export default new DB();
