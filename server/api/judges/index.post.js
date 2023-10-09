import Judge from '~/server/models/judge';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  try {
    const { name, rank, region } = await readBody(event);
    const response = await Judge.create({ name, rank, region });
    return response;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
