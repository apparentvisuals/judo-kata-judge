import Tournament from '~/server/models/tournament';
import db from '../../db';

import { notifyAllClients, createSummaryMessage, createReportMessage, getToken } from '../../utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(event.context.params.mat - 1);
  const tournament = await Tournament.get(token);
  const matInfo = tournament.getMat(mat);
  const matchInfo = tournament.getMatch(mat);

  if (matchInfo) {
    matchInfo.completed = true;
    await tournament.save();
    const nextMatch = tournament.getMatch(mat);
    const clients = db.clients(`${token}-${mat}`);
    if (nextMatch) {
      notifyAllClients(clients.report.list, createReportMessage(nextMatch.results));
    } else {
      notifyAllClients(clients.report.list, `data: ${JSON.stringify({ error: 'no more matches' })}\n\n`);
    }

    notifyAllClients(clients.summary.list, createSummaryMessage(matInfo));
  }

  return {};
});
