import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  try {
    const { name, org, showJudgeTotals } = await readBody(event);
    return await Tournament.create({ name, org, showJudgeTotals });
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
