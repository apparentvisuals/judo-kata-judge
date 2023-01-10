
import Clients from './clients';
import { createReport, numberOfTechniques } from './utils';

class DB {
  #tournament;
  createTournament(name = 'Tournament 1', numberOfMats = 1) {
    this.#tournament = {
      name,
      numberOfMats,
      mats: [],
    }
  }

  addMat(numberOfJudges) {
    const mats = this.#tournament.mats;
    const numberOfMats = this.#tournament.numberOfMats;
    if (mats.length >= numberOfMats) {
      return;
    }
    this.#tournament.mats.push({
      number: mats.length,
      numberOfJudges,
      matches: [],
      clients: new Clients(),
      reportClients: new Clients(),
      summaryClients: new Clients(),
    });
  }

  addMatch(mat, kata, tori, uke, numberOfJudges) {
    const matches = this.#tournament.mats[mat].matches;
    numberOfJudges = numberOfJudges || this.#tournament.mats[mat].numberOfJudges;
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
  }

  getMat(mat) {
    if (mat < this.#tournament.mats.length) {
      return this.#tournament.mats[mat];
    }
  }

  getMatch(mat) {
    return this.#tournament.mats[mat].matches.find((match) => !match.completed);
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

export default new DB();
