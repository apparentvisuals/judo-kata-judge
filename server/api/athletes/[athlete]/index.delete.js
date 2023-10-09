import Athlete from '~/server/models/athlete';
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
    const athleteId = getRouterParam(event, 'athlete');
    await Athlete.remove(athleteId.toUpperCase());
    const athletes = await Athlete.getAll();
    return athletes;
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: err.message });
  }
});
