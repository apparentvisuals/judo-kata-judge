import db from '../db';
import { getToken } from '../utils';
import { getAuth } from '../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  try {
    const { name, numberOfMats } = await readBody(event);
    const response = await db.createTournament(name, numberOfMats);
    return response;
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: err.message });
  }
});