import Tournament from '~/server/models/tournament';

import { getToken } from '~/server/utils';
import { getAuth } from '~/server/utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const tournament = await Tournament.get(tournamentId);
  await tournament.createMat();
  await tournament.save();
  return tournament.data;
});
