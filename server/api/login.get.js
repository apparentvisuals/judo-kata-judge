import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  const context = getAuth(token);
  if (!context) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }

  return context;
});
