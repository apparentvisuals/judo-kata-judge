import { v4 as uuidv4 } from 'uuid';

import db from '~/server/db';
import { createSummaryMessage } from '~/server/utils';
import Invite from '~/server/models/invite';
import { error } from '../models/cosmos';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }

  try {
    const tournament = await Invite.getTournament(token);
    const req = event.node.req;
    const res = event.node.res;
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
      console.log(`${id} summary connection closed`);
      clients.summary.remove(id);
    });
    res.write(createSummaryMessage(tournament.data));

    event._handled = true;
  } catch (err) {
    error(err.stack);
    return createError({ statusCode: 400, message: err.message });
  }
});
