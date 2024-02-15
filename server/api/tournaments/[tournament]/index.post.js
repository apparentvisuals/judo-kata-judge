import { omitBy, isNil } from 'lodash-es';
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

  const tournamentId = getRouterParam(event, 'tournament');
  if (!tournamentId) {
    return createError({ statusCode: 404, message: 'Tournament not found' });
  }
  const { name, org, showJudgeTotals, mats, _etag } = await readBody(event);
  if (!_etag) {
    return createError({ statusCode: 400, message: 'Invalid update data' });
  }

  try {
    return await Tournament.update(tournamentId, omitBy({ name, org, showJudgeTotals, mats }, isNil), { _etag });
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
