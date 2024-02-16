import Invite from '~/server/models/invite';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'invite');
  if (!id) {
    return createError({ statusCode: 404, message: 'Missing invite code' });
  }
  try {
    const tournament = await Invite.getTournament(id);
    return tournament.data;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
