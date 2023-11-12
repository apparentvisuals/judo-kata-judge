import Invite from '~/server/models/invite';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const inviteId = getRouterParam(event, 'invite');
  if (!inviteId) {
    return createError({ statusCode: 404, message: 'missing invite code' });
  }
  try {
    const invite = await Invite.get(inviteId);
    if (!invite) {
      return createError({ statusCode: 404, message: 'invite code not found' });
    }
    const { data } = invite;
    const tournament = await Tournament.get(data.tournament);
    if (!tournament) {
      return createError({ statusCode: 404, message: 'Tournament not found' });
    }
    return tournament.data;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
