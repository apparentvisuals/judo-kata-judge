import db from '../../db';

import { notifyAllClients, createSummaryMessage, createReportMessage } from '../../utils';

export default defineEventHandler(async (event) => {
  const mat = parseInt(event.context.params.mat - 1);

  const matInfo = db.getMat(mat);
  const matchInfo = db.getMatch(mat);

  if (matchInfo) {
    matchInfo.completed = true;

    const nextMatch = db.getMatch(mat);
    if (nextMatch) {
      notifyAllClients(matInfo.reportClients.clients, createReportMessage(nextMatch.results));
    } else {
      notifyAllClients(matInfo.reportClients.clients, `data: ${JSON.stringify({ error: 'no more matches' })}\n\n`);
    }

    notifyAllClients(matInfo.summaryClients.clients, createSummaryMessage(matInfo));
  }

  return {};
});
