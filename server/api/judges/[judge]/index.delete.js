import { getToken } from '../../../utils';
import { getAuth } from '../../../utils/auth-key';
import Judge from '~/server/models/judge';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, messsage: 'forbidden' });
  }
  try {
    const judgeId = getRouterParam(event, 'judge');
    if (!judgeId) {
      return createError({ statusCode: 404, statusMessage: 'Judge not found' });
    }
    await Judge.remove(judgeId.toUpperCase());
    const judges = await Judge.getAll();
    return judges;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
