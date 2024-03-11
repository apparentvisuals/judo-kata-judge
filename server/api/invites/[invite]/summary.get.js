import { v4 as uuidv4 } from 'uuid';

import db from '~/server/db';
import { createInitialSummaryEvent, objectToEventString } from '~/server/utils';
import { error } from '~/server/models/cosmos';

export default defineEventHandler(async (event) => {
  const invite = getRouterParam(event, 'invite');

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
    const clients = db.clients(`${invite}--1`);
    clients.summary.add(id, res);

    req.on('close', () => {
      console.log(`${id} summary connection closed`);
      clients.summary.remove(id);
    });
    res.write(objectToEventString(await createInitialSummaryEvent(invite)));

    event._handled = true;
  } catch (err) {
    error(err.stack);
    return createError({ statusCode: 400, message: err.message });
  }
});
