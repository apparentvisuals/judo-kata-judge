import { omit } from 'lodash-es';
import Judge from '~/server/models/judge';

export default defineEventHandler(async (event) => {
  try {
    const judges = await Judge.getAll();
    return judges.map((j) => omit(j, ['id']));
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
