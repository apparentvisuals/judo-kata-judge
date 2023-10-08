import Tournament from '~/server/models/tournament';

import { getToken } from '../../utils';
import { getAuth } from '../../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  try {
    const { name, showJudgeTotals } = await readBody(event);
    const tournament = await Tournament.create({ name, showJudgeTotals });
    return tournament.data;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
