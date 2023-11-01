import Tournament from '~/server/models/tournament';
import db from '../../db';
import { notifyAllClients, createUpdateMessage, createReportMessage, createReport, createSummaryMessage } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }

  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const judgeNumber = parseInt(getRouterParam(event, 'judge')) - 1;

  const judgeScores = await readBody(event);

  const tournament = await Tournament.get(token);
  const { match, index, groupIndex } = tournament.getNextMatch(matNumber);
  if (!match) {
    return createError({ statusCode: 404, message: 'no more matches' })
  }

  match.scores[judgeNumber] = judgeScores;
  const updatedMatch = tournament.updateMatch(matNumber, groupIndex, index, { scores: match.scores, completed: _IsMatchComplete(match.scores) });
  await tournament.save();

  const clients = db.clients(`${token}-${matNumber}`);
  notifyAllClients(clients.match.list, createUpdateMessage(tournament, matNumber));
  if (updatedMatch.completed) {
    const summaryClients = db.clients(`${token}--1`);
    notifyAllClients(summaryClients.summary.list, createSummaryMessage(tournament.data));
  }
  return;
  // return updatedMatch.scores[judgeNumber];
});

function _IsMatchComplete(scores) {
  return scores.every((judgeScore) => judgeScore.name);
}
