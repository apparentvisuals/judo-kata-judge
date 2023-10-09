import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createReportMessage } from '~/server/utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return;
  }

  const req = event.node.req;
  const res = event.node.res;

  const mat = parseInt(getRouterParam(event, 'mat')) - 1;
  const tournament = await Tournament.get(token);
  const matchInfo = tournament.getMatch(mat);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  setHeaders(event, headers);

  if (matchInfo) {
    const id = uuidv4();
    const clients = db.clients(`${token}-${mat}`);
    clients.report.add(id, res);

    req.on('close', () => {
      console.log(`m${mat}:${id} report connection closed`);
      clients.report.remove(id);
    });
    res.write(createReportMessage(matchInfo.results));

    event._handled = true;

  } else {
    res.write(`data: ${JSON.stringify({ error: 'no more matches' })}\n\n`);
    res.end();
  }
});
