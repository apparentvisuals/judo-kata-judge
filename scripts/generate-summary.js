import { omit } from 'lodash-es';
import { database, log } from "../server/models/cosmos.js";
import { calculateHasMajor, calculateMoveScore, moveList } from '../src/utils.js';

export function numberOfTechniques(kata) {
  return moveList(kata).length;
}

export function createReport(group, match) {
  const kata = group.kata;
  const numberOfJudges = group.numberOfJudges;
  const scores = match.scores;
  const techniquesCount = numberOfTechniques(kata);
  const report = _defaultTechniqueScore(group, match);
  const summary = {
    total: 0,
    values: new Array(numberOfJudges),
  }
  for (let ii = 0; ii < numberOfJudges; ii++) {
    const judgeScores = scores[ii];
    if (judgeScores.scores) {
      let total = 0;
      const hasMajor = calculateHasMajor(judgeScores.scores);
      for (let jj = 0; jj < techniquesCount; jj++) {
        const deductions = (judgeScores.scores[jj] && judgeScores.scores[jj].deductions ? judgeScores.scores[jj].deductions : ':::::').split(':');
        let value = calculateMoveScore(deductions);
        value = hasMajor && !group.disableDivideByHalf ? value / 2 : value;
        report[jj].values[ii] = value;
        total += value;
      }
      summary.values[ii] = total;
    }
  }

  let total = 0;
  report.forEach((technique) => {
    let min = 11;
    let max = -1;
    let subTotal = 0;
    for (let ii = 0; ii < numberOfJudges; ii++) {
      const value = technique.values[ii];
      subTotal += value;
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    if (numberOfJudges > 3) {
      subTotal -= min;
    }
    if (numberOfJudges > 4) {
      subTotal -= max;
    }
    technique.total = subTotal;
    total += subTotal;
  });
  summary.total = total;

  return { report, summary };
}

export function isMatchComplete(match) {
  const numberOfJudges = match.numberOfJudges;
  const scores = match.scores;
  let completed = true;
  for (let ii = 0; ii < numberOfJudges; ii++) {
    if (scores[ii].name == null) {
      completed = false;
      break;
    }
  }
  return completed;
}

export function matchDataToScores(match) {
  // 0 if this match has no submissions
  const numberOfJudges = match.numberOfJudges || 0;
  const scores = Array(numberOfJudges);
  for (let ii = 0; ii < numberOfJudges; ii++) {
    if (match[ii + 1]) {
      scores[ii] = match[ii + 1];
    }
  }
  return scores;
}

function _defaultTechniqueScore(group, match) {
  const kata = group.kata;
  const numberOfJudges = (match.score && match.scores.length) || group.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const report = new Array(techniquesCount).fill().map((_el) => {
    return { values: new Array(numberOfJudges).fill().map(() => 10) };
  });
  return report;
}

const tournamentsDev = database.container('tournaments');
const matchesDev = database.container('matches');

const querySpec = { query: 'SELECT * from c' };
const response = await tournamentsDev.items.query(querySpec).fetchAll();
log('get all tournaments', response);

const normalizedTournaments = response.resources;
for (let tournament of normalizedTournaments) {
  for (let mat of (tournament.mats || [])) {
    for (let group of (mat.groups || [])) {
      for (let match of (group.matches || [])) {
        const response = await matchesDev.item(match.id).read();
        const matchData = response.resource;
        const scores = matchDataToScores(matchData);
        const results = createReport(group, { scores });
        const summary = { scores: results.summary.values, total: results.summary.total };
        match.summary = summary;
      }
    }
  }
  const response = await tournamentsDev.items.upsert(tournament);
  log(`updated tournament with id ${response.resource.id}`, response);
}
