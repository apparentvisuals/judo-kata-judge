import db from '../db';
import { isDev } from '../utils';
import { getAuth } from '../utils/auth-key';

export default defineEventHandler(async (event) => {
  const { name, numberOfMats } = await readBody(event);
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  const response = await db.createTournament(name, numberOfMats);
  return response;
});
