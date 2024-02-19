import { v4 as uuidv4 } from 'uuid';

import db from '../../db';
import { createUpdateMessage } from '~/server/utils';
import Invite from '~/server/models/invite';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }

  const matNumber = parseInt(getRouterParam(event, 'mat'));

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
    const clients = db.clients(`${token}-${matNumber}`);
    clients.match.add(id, res);

    req.on('close', () => {
      console.log(`m${matNumber}:${id} connection closed`);
      clients.match.remove(id);
    });

    const message = await createUpdateMessage(tournament, matNumber);
    res.write(message);

    event._handled = true;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
