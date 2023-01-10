import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createReportMessage } from '../../utils';

export default defineEventHandler((event) => {
  const req = event.req;
  const res = event.res;

  const mat = parseInt(event.context.params.mat - 1);
  const matInfo = db.getMat(mat);
  const matchInfo = db.getMatch(mat);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  if (matchInfo) {
    res.write(createReportMessage(matchInfo.results));

    const id = uuidv4();
    matInfo.reportClients.add(id, res);

    req.on('close', () => {
      console.log(`m${mat}:${id} report connection closed`);
      matInfo.reportClients.remove(id);
    });
  } else {
    res.write(`data: ${JSON.stringify({ error: 'no more matches' })}\n\n`);
    res.end();
  }
});
