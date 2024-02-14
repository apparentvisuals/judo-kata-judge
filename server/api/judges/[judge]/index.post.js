import { omitBy, isNil } from 'lodash-es';
import Judge from '~/server/models/judge';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }

  const judgeId = getRouterParam(event, 'judge');
  if (!judgeId) {
    return createError({ statusCode: 404, message: 'Judge not found' });
  }
  const { name, rank, region, _etag } = await readBody(event);
  if (!_etag) {
    return createError({ statusCode: 400, message: 'Invalid update data' });
  }

  try {
    return await Judge.update(judgeId.toUpperCase(), omitBy({ name, rank, region }, isNil), { _etag });
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
