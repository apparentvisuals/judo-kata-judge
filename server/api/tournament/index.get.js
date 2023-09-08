import db from '../../db';
import { getToken } from '../../utils';
import { getAuth } from '../../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, messsage: 'forbidden' });
  }
  try {
    const tournaments = await db.getAllTournaments();
    return tournaments;
  } catch (err) {
    throw createError({ statusCode: 400, messsage: err.message });
  }
});
