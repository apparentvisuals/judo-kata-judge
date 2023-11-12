import Invite from '~/server/models/invite';
import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  if (!tournamentId) {
    return createError({ statusCode: 404, message: 'Tournament not found' });
  }
  try {
    const tournament = await Tournament.get(tournamentId);
    if (!tournament) {
      return createError({ statusCode: 404, message: 'Tournament not found' });
    }
    const invite = await Invite.create({ tournament: tournament.id });
    tournament.addInvite(invite.id);
    tournament.save();
    return { id: invite.id };
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
