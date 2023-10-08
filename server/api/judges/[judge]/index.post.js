import Judge from '~/server/models/judge';
import { getToken } from '~/server/utils';
import { getAuth } from '~/server/utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  try {
    const judgeId = getRouterParam(event, 'judge');
    if (!judgeId) {
      return createError({ statusCode: 404, statusMessage: 'Judge not found' });
    }
    const { name, rank, region } = await readBody(event);
    const response = await Judge.update(judgeId.toUpperCase(), { name, rank, region });
    return response;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
