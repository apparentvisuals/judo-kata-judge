import Judge from '~/server/models/judge';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  try {
    const { name, region, nnk, knk, jnk, kgj, kink, konk, ink } = await readBody(event);
    return await Judge.create({ name, region, nnk, knk, jnk, kgj, kink, konk, ink });
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
