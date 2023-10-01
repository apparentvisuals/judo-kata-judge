import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createNoMatchMessage, createUpdateMessage, getToken } from '../../utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat'));

  const tournament = await Tournament.get(token);
  const { match, index } = tournament.getMatch(mat);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  setHeaders(event, headers);

  const req = event.node.req;
  const res = event.node.res;
  if (!match) {
    res.write(createNoMatchMessage());
    res.end();
    return;
  }
  if (match.completed) {
    res.write(createUpdateMessage(match.scores, index));
    res.end();
    return;
  }
  const id = uuidv4();
  const clients = db.clients(`${token}-${mat}`);
  clients.match.add(id, res);

  req.on('close', () => {
    console.log(`m${mat}:${id} connection closed`);
    clients.match.remove(id);
  });
  const message = createUpdateMessage(match.scores, index);
  console.log(message);
  res.write(message);

  event._handled = true;
});
