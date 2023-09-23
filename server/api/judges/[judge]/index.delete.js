import { getToken } from '../../../utils';
import { getAuth } from '../../../utils/auth-key';
import Judge from '~/server/models/judge';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, messsage: 'forbidden' });
  }
  try {
    const judgeId = getRouterParam(event, 'judge');
    await Judge.remove(judgeId);
    return {};
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: err.message });
  }
});
