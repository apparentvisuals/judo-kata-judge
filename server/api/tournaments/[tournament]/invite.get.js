import Invite from '~/server/models/invite';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  try {
    const tournamentId = getRouterParam(event, 'tournament');
    if (!tournamentId) {
      return createError({ statusCode: 404, message: 'Tournament not found' });
    }
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
