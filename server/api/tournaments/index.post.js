import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  try {
    const { name, org, showJudgeTotals } = await readBody(event);
    const tournament = await Tournament.create({ name, org, showJudgeTotals });
    return tournament.data;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
