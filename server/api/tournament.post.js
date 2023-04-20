import db from '../db';
import { isDev } from '../utils';
import { getAuth } from '../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  const { name, numberOfMats } = await readBody(event);
  const response = await db.createTournament(name, numberOfMats);
  return response;
});
