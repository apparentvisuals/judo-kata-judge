import { customAlphabet } from 'nanoid';
import { pick } from 'lodash-es';
import { moveList } from '~/src/utils';

export const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

export function isDev() {
  return process.env.NODE_ENV !== 'production';
}

export function getToken(event) {
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }
  return token;
}

export function getAuth() {
  return process.env.AUTH_KEY;
}

export function createNoMatchMessage() {
  return `data: ${JSON.stringify({ error: 'no more matches' })}\n\n`
}

export function createUpdateMessage(tournament, mat) {
  const update = {
    tournament: tournament.data.name,
    org: tournament.data.org,
    mat,
  };
  const { match, index, groupIndex } = tournament.getNextMatch(mat);
  if (match) {
    const scores = match.scores;
    const completed = scores.every((judgeScore) => judgeScore.name);
    const judgeState = scores.map((judgeScore) => !!judgeScore.name);
    update.match = pick(match, ['kata', 'tori', 'uke', 'numberOfJudges']);
    update.index = index;
    update.groupIndex = groupIndex;
    update.state = judgeState;
    update.completed = completed;
  } else {
    update.index = -1;
  }
  return `data: ${JSON.stringify(update)}\n\n`;
}

export function createReportMessage(report) {
  return `data: ${JSON.stringify(report)}\n\n`;
}

export function createSummaryMessage(tournament) {
  const summary = { name: tournament.name, org: tournament.org, showJudgeTotals: tournament.showJudgeTotals, results: [] };
  for (const mat of tournament.mats) {
    const groups = mat.groups;
    const groupsSummary = groups.map((group) => {
      const matches = group.matches;
      const summary = matches.map((match) => {
        const matchSummary = {
          number: match.number,
          kata: group.kata,
          tori: match.tori,
          uke: match.uke,
          scores: [],
        }
        if (match.completed) {
          matchSummary.scores = match.results.summary.values;
          matchSummary.total = match.results.summary.total;
        }
        return matchSummary;
      });
      return { name: group.name, kata: group.kata, matches: summary };
    });
    summary.results.push(...groupsSummary);
  }
  return `data: ${JSON.stringify(summary)}\n\n`;
}

export function notifyAllClients(clients, message) {
  for (const res of clients) {
    res.write(message);
  }
}

export function numberOfTechniques(kata) {
  return moveList(kata).length;
}

export function calculateMoveScore(deductions) {
  let total = 10;
  if (deductions[0] === '1') {
    total -= 1;
  }
  if (deductions[1] === '1') {
    total -= 1;
  }
  if (deductions[2] === '1') {
    total -= 3;
  }
  if (deductions[3] === '1') {
    total -= 5;
  }
  if (deductions[4] === '1') {
    total -= 10;
  }
  if (deductions[5] === '+') {
    total += 0.5;
  } else if (deductions[5] === '-') {
    total -= 0.5;
  }
  return Math.min(Math.max(0, total), 10);
}

export function createReport(match) {
  const scores = match.scores;
  const kata = match.kata;
  const numberOfJudges = match.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const report = _defaultTechniqueScore(match);
  const summary = {
    total: 0,
    values: new Array(numberOfJudges),
  }
  for (let ii = 0; ii < numberOfJudges; ii++) {
    const judgeScores = scores[ii];
    let hasMajor = false;
    let total = 0;
    if (judgeScores.scores) {
      for (let jj = 0; jj < techniquesCount; jj++) {
        const deductions = judgeScores.scores[jj].deductions.split(':');
        let value = calculateMoveScore(deductions);
        report[jj].values[ii] = value;
        total += value;
        if (deductions[4] === '1') {
          hasMajor = true;
        }
      }
      if (hasMajor) {
        total = total / 2;
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
    if (match.numberOfJudges > 3) {
      subTotal -= min;
    }
    if (match.numberOfJudges > 4) {
      subTotal -= max;
    }
    technique.total = subTotal;
    total += subTotal;
  });
  summary.total = total;

  return { report, summary };
}

function _defaultTechniqueScore(match) {
  const kata = match.kata;
  const numberOfJudges = match.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const list = moveList(kata);
  const report = new Array(techniquesCount).fill().map((_el) => {
    return { values: new Array(numberOfJudges).fill().map(() => 10) };
  });
  return report;
}
