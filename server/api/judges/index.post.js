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
    const { name, rank, region } = await readBody(event);
    return await Judge.create({ name, rank, region });
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
