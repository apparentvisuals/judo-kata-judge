import { customAlphabet } from 'nanoid';
import { omit, pick } from 'lodash-es';
import { moveList, calculateHasMajor, calculateMoveScore } from '~/src/utils';
import Match from './models/match';
import Invite from './models/invite';

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

export function objectToEventString(object) {
  if (object) {
    return `data: ${JSON.stringify(object)}\n\n`;
  }
  return 'data: \n\n';
}

export function createNoMatchMessage() {
  return `data: ${JSON.stringify({ error: 'no more matches' })}\n\n`
}

export async function createInitialUpdateEvent(id, matNumber) {
  const initialUpdateEvent = {};
  const tournament = await Invite.getTournament(id);
  initialUpdateEvent.tournament = pick(tournament.data, ['name', 'org']);

  const updateEvent = await createUpdateEvent(tournament, matNumber);
  Object.assign(initialUpdateEvent, updateEvent);
  return initialUpdateEvent;
}

export async function createUpdateEvent(tournament, matNumber) {
  const update = {
    matNumber,
  };
  const { match, group, matchIndex, groupIndex } = tournament.getNextMatch(matNumber);
  if (match) {
    const matchData = await Match.get(match.id);
    const scores = matchDataToScores(matchData, group);
    const judgeState = scores.map((judgeScore) => !!judgeScore.name);
    update.match = match;
    update.group = pick(group, ['kata', 'name', 'numberOfJudges', 'disableDivideByHalf', 'disableMajor', 'disableForgotten']);
    update.matchIndex = matchIndex;
    update.groupIndex = groupIndex;
    update.state = judgeState;
  } else {
    update.matchIndex = -1;
    update.groupIndex = -1;
  }
  return update;
}

export async function createInitialSummaryEvent(id) {
  const initialSummaryEvent = {};
  const tournament = await Invite.getTournament(id);
  initialSummaryEvent.tournament = pick(tournament.data, ['name', 'org', 'showJudgeTotals']);

  const summaryEvent = createSummaryEvent(tournament.data);
  Object.assign(initialSummaryEvent, summaryEvent);
  return initialSummaryEvent;
}

export function createSummaryEvent(tournament) {
  const summary = { results: [] };
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
          matchSummary.scores = match.summary.scores;
          matchSummary.total = match.summary.total;
        }
        return matchSummary;
      });
      return { name: group.name, kata: group.kata, matches: summary };
    });
    summary.results.push(...groupsSummary);
  }
  return summary;
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
          matchSummary.scores = match.summary.scores;
          matchSummary.total = match.summary.total;
        }
        return matchSummary;
      });
      return { name: group.name, kata: group.kata, matches: summary };
    });
    summary.results.push(...groupsSummary);
  }
  return summary;
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
  const numberOfJudges = match.completed ? match.scores.length : group.numberOfJudges;
  const scores = match.scores;
  const techniquesCount = numberOfTechniques(kata);
  const report = _defaultTechniqueScore(numberOfJudges, techniquesCount);
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

export function matchDataToScores(match, group) {
  // 0 if this match has no submissions
  // if match is completed then use array size instead of numberOfJudges
  const numberOfJudges = match.numberOfJudges || group.numberOfJudges || 0;
  const scores = Array(numberOfJudges);
  for (let ii = 0; ii < numberOfJudges; ii++) {
    if (match[ii + 1]) {
      scores[ii] = match[ii + 1];
    } else {
      scores[ii] = {};
    }
  }
  return scores;
}

function _defaultTechniqueScore(numberOfJudges, techniquesCount) {
  const report = new Array(techniquesCount).fill().map((_el) => {
    return { values: new Array(numberOfJudges).fill().map(() => 10) };
  });
  return report;
}
