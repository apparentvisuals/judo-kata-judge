import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const matNumber = getRouterParam(event, 'mat');
  const { numberOfJudges, name, kata } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  await tournament.createGroup(matNumber, { name, kata, numberOfJudges });
  await tournament.save();
  return tournament.data;
});
