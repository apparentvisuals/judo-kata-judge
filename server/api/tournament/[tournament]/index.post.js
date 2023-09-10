import db from '../../../db';
import { getToken } from '../../../utils';
import { getAuth } from '../../../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, messsage: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const body = await readBody(event);
  const tournament = await db.tournament(tournamentId);
  tournament.replace(body);
  await tournament.save();
  return tournament.data;
});
