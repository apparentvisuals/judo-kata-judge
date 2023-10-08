import Tournament from '~/server/models/tournament';
import db from '../../../db';
import { getToken } from '../../../utils';
import { getAuth } from '../../../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, messsage: 'forbidden' });
  }
  try {
    const tournamentId = getRouterParam(event, 'tournament');
    if (!tournamentId) {
      return createError({ statusCode: 404, messsage: 'Tournament not found' });
    }
    await Tournament.remove(tournamentId);
    const tournaments = await Tournament.getAll();
    return tournaments;
  } catch (err) {
    return createError({ statusCode: 400, messsage: err.message });
  }

});
