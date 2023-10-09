import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  try {
    const tournamentId = getRouterParam(event, 'tournament');
    if (!tournamentId) {
      return createError({ statusCode: 404, statusMessage: 'Tournament not found' });
    }
    await Tournament.remove(tournamentId);
    const tournaments = await Tournament.getAll();
    return tournaments;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }

});
