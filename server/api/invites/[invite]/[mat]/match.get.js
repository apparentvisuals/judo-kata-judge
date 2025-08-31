import Invite from '~/server/models/invite';
import Judge from '~/server/models/judge';

import { createInitialUpdateEvent } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const invite = getRouterParam(event, 'invite');
  const matNumber = parseInt(getRouterParam(event, 'mat'));

  const inviteData = await Invite.get(invite);
  if (!inviteData) {
    return createError({ statusCode: 404, message: 'Judge not found' });
  }

  try {
    const update = await createInitialUpdateEvent(invite, matNumber);
    return update;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
