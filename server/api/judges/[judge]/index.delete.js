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
    await Judge.remove(judgeId);
    const judges = await Judge.getAll();
    return judges;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
