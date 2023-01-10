import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createUpdateMessage } from '../../utils';

export default defineEventHandler(async (event) => {
  const token = getTournamentToken(event);
  if (!token) {
    return;
  }

  const req = event.req;
  const res = event.res;
  const mat = parseInt(event.context.params.mat - 1);

  const tournament = await db.tournament(token);
  const matInfo = tournament.getMatch(mat);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  for (const judge of matInfo.judges.values()) {
    res.write(createUpdateMessage(judge));
  }

  const id = uuidv4();
  const clients = db.clients(`${token}-${mat}`);
  clients.match.add(id, res);

  req.on('close', () => {
    console.log(`m${mat}:${id} connection closed`);
    clients.match.remove(id);
  });
});
