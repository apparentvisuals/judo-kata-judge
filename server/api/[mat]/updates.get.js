import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createNoMatchMessage, createUpdateMessage } from '~/server/utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return;
  }

  const matNumber = parseInt(getRouterParam(event, 'mat'));

  const tournament = await Tournament.get(token);
  const mat = tournament.getMat(matNumber);
  const { match, index } = tournament.getMatch(matNumber);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  setHeaders(event, headers);

  const req = event.node.req;
  const res = event.node.res;

  const id = uuidv4();
  const clients = db.clients(`${token}-${matNumber}`);
  clients.match.add(id, res);

  req.on('close', () => {
    console.log(`m${matNumber}:${id} connection closed`);
    clients.match.remove(id);
  });
  const message = createUpdateMessage(tournament, matNumber);
  res.write(message);

  event._handled = true;
});
