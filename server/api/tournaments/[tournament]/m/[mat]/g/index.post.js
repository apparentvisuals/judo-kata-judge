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
  const matNumber = getRouterParam(event, 'mat');
  const { numberOfJudges, name, kata } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  await tournament.createGroup(matNumber, { name, kata, numberOfJudges });
  await tournament.save();
  return tournament.data;
});
