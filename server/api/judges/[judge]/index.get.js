import { getToken } from '../../../utils';
import Judge from '~/server/models/judge';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const tournament = await Tournament.get(token);
  if (!tournament) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' });
  }

  try {
    const judgeId = getRouterParam(event, 'judge');
    const judge = await Judge.get(judgeId);
    if (!judge) {
      return createError({ statusCode: 404, statusMessage: 'Judge not found' });
    }
    return judge;
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: err.message });
  }
});
