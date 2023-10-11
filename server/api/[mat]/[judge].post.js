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

  const scores = await readBody(event);

  const tournament = await Tournament.get(token);
  const { match } = tournament.getMatch(matNumber);
  if (!match) {
    return createError({ statusCode: 404, statusMessage: 'no more matches' })
  }

  match.scores[judgeNumber] = scores;
  match.results = createReport(match);
  match.completed = _IsMatchComplete(match.scores);
  await tournament.save();

  const clients = db.clients(`${token}-${matNumber}`);
  notifyAllClients(clients.match.list, createUpdateMessage(tournament, matNumber));
  // notifyAllClients(clients.report.list, createReportMessage(match.results));
  if (match.completed) {
    const mat = tournament.getMat(matNumber);
    notifyAllClients(clients.summary.list, createSummaryMessage(mat));
  }
  return match.scores[judgeNumber];
});

function _IsMatchComplete(scores) {
  return scores.every((judgeScore) => judgeScore.name);
}
