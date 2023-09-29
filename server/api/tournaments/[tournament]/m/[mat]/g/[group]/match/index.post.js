import Tournament from '~/server/models/tournament';

import { getToken } from '~/server/utils';
import { getAuth } from '~/server/utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, messsage: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const groupNumber = parseInt(getRouterParam(event, 'group'));
  const { kata, tori, uke } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  await tournament.createMatch(matNumber, groupNumber, { kata, tori, uke });
  await tournament.save();
  return tournament.data;
});
