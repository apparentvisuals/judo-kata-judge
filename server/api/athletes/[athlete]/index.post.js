import { omitBy, isNil } from 'lodash-es';
import Athlete from '~/server/models/athlete';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  const athleteId = getRouterParam(event, 'athlete');
  if (!athleteId) {
    return createError({ statusCode: 404, message: 'Athlete not found' });
  }
  const { name, rank, region, _etag } = await readBody(event);
  if (!_etag) {
    return createError({ statusCode: 400, message: 'Invalid update data' });
  }

  try {
    return await Athlete.update(athleteId, omitBy({ name, rank, region }, isNil), { _etag });
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
