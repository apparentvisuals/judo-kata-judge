import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }

  const tournamentId = getRouterParam(event, 'tournament');
  const mat = parseInt(getRouterParam(event, 'mat'));
  const { numberOfJudges, startTime } = await readBody(event);
  try {
    const tournament = await Tournament.get(tournamentId);
    tournament.updateMat(mat, numberOfJudges, startTime);
    await tournament.save();
    return tournament.data;
  } catch (err) {
    switch (err.message) {
      case 'no such tournament found':
        return;
      default:
        sendError(event, createError({ statusCode: 500, message: err.message }));
    }
  }

});
