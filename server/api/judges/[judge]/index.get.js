import { getToken } from '~/server/utils';
import Judge from '~/server/models/judge';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const tournament = await Tournament.get(token);
  if (!tournament) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }

  try {
    const judgeId = getRouterParam(event, 'judge');
    if (!judgeId) {
      return createError({ statusCode: 404, message: 'Judge not found' });
    }
    const judge = await Judge.get(judgeId.toUpperCase());
    if (!judge) {
      return createError({ statusCode: 404, message: 'Judge not found' });
    }
    return judge;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
