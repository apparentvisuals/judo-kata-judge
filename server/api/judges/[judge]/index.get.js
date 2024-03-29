import Judge from '~/server/models/judge';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }

  const judgeId = getRouterParam(event, 'judge');
  if (!judgeId) {
    return createError({ statusCode: 404, message: 'Judge not found' });
  }

  try {
    const judge = await Judge.get(judgeId.toUpperCase());
    if (!judge) {
      return createError({ statusCode: 404, message: 'Judge not found' });
    }
    return judge;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
