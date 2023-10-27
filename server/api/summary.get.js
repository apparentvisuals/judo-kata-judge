import { v4 as uuidv4 } from 'uuid';

import db from '~/server/db';
import { createSummaryMessage } from '~/server/utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return;
  }

  const req = event.node.req;
  const res = event.node.res;

  const tournament = await Tournament.get(token);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  setHeaders(event, headers);

  const id = uuidv4();
  const clients = db.clients(`${token}--1`);
  clients.summary.add(id, res);

  req.on('close', () => {
    console.log(`${mat}:${id} summary connection closed`);
    clients.summary.remove(id);
  });
  res.write(createSummaryMessage(tournament.data));

  event._handled = true;
});
