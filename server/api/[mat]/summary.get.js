import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createSummaryMessage } from '../../utils';

export default defineEventHandler((event) => {
  const req = event.req;
  const res = event.res;

  const mat = parseInt(event.context.params.mat - 1);
  const matInfo = db.getMat(mat);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  res.write(createSummaryMessage(matInfo));

  const id = uuidv4();
  matInfo.summaryClients.add(id, res);

  req.on('close', () => {
    console.log(`${mat}:${id} summary connection closed`);
    matInfo.summaryClients.remove(id);
  });
});
