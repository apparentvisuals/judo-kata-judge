import Tournament from '~/server/models/tournament';
import db from '../../db';
import { notifyAllClients, createUpdateMessage, createReportMessage, createReport } from '../../utils';

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat'));
  const judge = parseInt(getRouterParam(event, 'judge')) - 1;

  const scores = await readBody(event);

  const tournament = await Tournament.get(token);
  const match = tournament.getMatch(mat);
  if (!match) {
    return {};
  }

  match.scores[judge] = scores;
  match.completed = _IsMatchComplete(match);
  match.results = createReport(match);
  await tournament.save();

  // const clients = db.clients(`${token}-${mat}`);
  // notifyAllClients(clients.match.list, createUpdateMessage(judgeInfo));
  // notifyAllClients(clients.report.list, createReportMessage(match.results));

  return match.scores[judge];
});

function _IsMatchComplete(match) {
  return match.scores.every((judgeScore) => judgeScore.name);
}
