import Athlete from '~/server/models/athlete';
import { getToken } from '~/server/utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }

  const tournament = await Tournament.get(token);
  if (!tournament) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }

  try {
    const athleteId = getRouterParam(event, 'athlete');
    const athlete = await Athlete.get(athleteId.toUpperCase());
    if (!athlete) {
      return createError({ statusCode: 404, message: 'Athlete not found' });
    }
    return athlete;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
