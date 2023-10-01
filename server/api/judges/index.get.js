import Judge from '~/server/models/judge';

import { getToken } from '../../utils';
import { getAuth } from '../../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, messsage: 'forbidden' });
  }
  try {
    const judges = await Judge.getAll();
    return judges;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
