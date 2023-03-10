import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createSummaryMessage } from '../../utils';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return;
  }

  const req = event.req;
  const res = event.res;

  const mat = parseInt(event.context.params.mat - 1);
  const tournament = await db.tournament(token);
  const matInfo = tournament.getMat(mat);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  setHeaders(event, headers);

  if (matInfo) {
    res.write(createSummaryMessage(matInfo));

    const id = uuidv4();
    const clients = db.clients(`${token}-${mat}`);
    clients.summary.add(id, res);

    req.on('close', () => {
      console.log(`${mat}:${id} summary connection closed`);
      clients.summary.remove(id);
    });
  } else {
    res.write(`data: ${JSON.stringify({ error: 'no more matches' })}\n\n`);
    res.end();
  }
});
