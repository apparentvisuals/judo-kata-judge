import { v4 as uuidv4 } from 'uuid';

import db from '~/server/db';
import { createInitialUpdateEvent, objectToEventString } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const invite = getRouterParam(event, 'invite');
  const matNumber = parseInt(getRouterParam(event, 'mat'));

  try {
    const req = event.node.req;
    const res = event.node.res;
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    setHeaders(event, headers);

    const id = uuidv4();
    const clients = db.clients(`status-${invite}-${matNumber}`);
    clients.match.add(id, res);

    req.on('close', () => {
      console.log(`m${matNumber}:${id} connection closed`);
      clients.match.remove(id);
    });

    const update = await createInitialUpdateEvent(invite, matNumber);
    const message = objectToEventString(update.state);
    res.write(message);

    event._handled = true;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
