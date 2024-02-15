import { customAlphabet } from 'nanoid';
import { omit } from 'lodash-es';
import { moveList, calculateHasMajor, calculateMoveScore } from '~/src/utils';

export const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

const KEYSET = {
  [process.env.AUTH_KEY]: {},
  [process.env.JC_KEY]: { org: 'jc' },
  [process.env.AB_KEY]: { org: 'ab' },
  [process.env.BC_KEY]: { org: 'bc' },
  [process.env.SK_KEY]: { org: 'sk' },
  [process.env.MB_KEY]: { org: 'mb' },
  [process.env.ON_KEY]: { org: 'on' },
  [process.env.QC_KEY]: { org: 'qc' },
  [process.env.NB_KEY]: { org: 'nb' },
  [process.env.NS_KEY]: { org: 'ns' },
  [process.env.PE_KEY]: { org: 'pe' },
  [process.env.NL_KEY]: { org: 'nl' },
  [process.env.YT_KEY]: { org: 'yt' },
  [process.env.NT_KEY]: { org: 'nt' },
  [process.env.NU_KEY]: { org: 'nu' },
};

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

export function getAuth(key) {
  if (key) {
    const context = KEYSET[key];
    if (context) {
      return context;
    }
  }
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
    const completed = isMatchComplete(match);
    const judgeState = scores.map((judgeScore) => !!judgeScore.name);
    update.match = omit(match, 'scores');
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
        const results = createReport(group, match);
        if (match.completed) {
          matchSummary.scores = results.summary.values;
          matchSummary.total = results.summary.total;
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

function _defaultTechniqueScore(group, match) {
  const kata = group.kata;
  const numberOfJudges = (match.score && match.scores.length) || group.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const report = new Array(techniquesCount).fill().map((_el) => {
    return { values: new Array(numberOfJudges).fill().map(() => 10) };
  });
  return report;
}
