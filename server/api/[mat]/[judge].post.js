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

  const mat = parseInt(event.context.params.mat - 1);
  const judge = parseInt(event.context.params.judge - 1);
  const { move, deductions } = await readBody(event);

  const tournament = await Tournament.get(token);
  const matchInfo = tournament.getMatch(mat);
  if (!matchInfo) {
    return {};
  }
  const judgeInfo = matchInfo.judges[judge];
  judgeInfo.scores[move].deductions = deductions;
  matchInfo.results = createReport(matchInfo);
  await tournament.save();

  const clients = db.clients(`${token}-${mat}`);
  notifyAllClients(clients.match.list, createUpdateMessage(judgeInfo));
  notifyAllClients(clients.report.list, createReportMessage(matchInfo.results));

  return {};
});
