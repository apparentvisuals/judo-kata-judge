import Tournament from '~/server/models/tournament';
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
  const tournamentId = getRouterParam(event, 'tournament');
  if (!tournamentId) {
    return createError({ statusCode: 404, messsage: 'Tournament not found' });
  }
  const body = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  if (!tournament) {
    return createError({ statusCode: 404, messsage: 'Tournament not found' });
  }
  tournament.replace(body);
  await tournament.save();
  return tournament.data;
});
