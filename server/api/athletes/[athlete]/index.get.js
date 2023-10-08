import Athlete from '~/server/models/athlete';
import { getToken } from '../../../utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const tournament = await Tournament.get(token);
  if (!tournament) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' });
  }

  try {
    const athleteId = getRouterParam(event, 'judge');
    const athlete = await Athlete.get(athleteId.toUpperCase());
    if (!athlete) {
      return createError({ statusCode: 404, statusMessage: 'Judge not found' });
    }
    return athlete;
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: err.message });
  }
});
