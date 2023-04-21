import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createReportMessage, getToken } from '../../utils';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return;
  }

  const req = event.req;
  const res = event.res;

  const mat = parseInt(getRouterParams(event, 'mat')) - 1;
  const tournament = await db.tournament(token);
  const matchInfo = tournament.getMatch(mat);


  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  setHeaders(event, headers);

  if (matchInfo) {
    res.write(createReportMessage(matchInfo.results));

    const id = uuidv4();
    const clients = db.clients(`${token}-${mat}`);
    clients.report.add(id, res);

    req.on('close', () => {
      console.log(`m${mat}:${id} report connection closed`);
      clients.report.remove(id);
    });
  } else {
    res.write(`data: ${JSON.stringify({ error: 'no more matches' })}\n\n`);
    res.end();
  }
});
