import db from '../db';
import { getTournamentToken, isDev } from '../utils';
import { getAuth } from '../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getTournamentToken(event);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  try {
    const tournament = await db.tournament(token);
    return tournament.data;
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: err.message });
  }

});
