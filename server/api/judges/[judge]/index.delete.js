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
  try {
    const judgeId = getRouterParam(event, 'judge');
    if (!judgeId) {
      return createError({ statusCode: 404, message: 'Judge not found' });
    }
    await Judge.remove(judgeId.toUpperCase());
    const judges = await Judge.getAll();
    return judges;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
