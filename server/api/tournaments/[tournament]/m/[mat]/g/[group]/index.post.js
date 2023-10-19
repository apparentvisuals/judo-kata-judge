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
  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const groupNumber = parseInt(getRouterParam(event, 'group'));
  const { numberOfJudges, name, kata, startTime } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  await tournament.updateGroup(matNumber, groupNumber, { name, kata, numberOfJudges, startTime });
  await tournament.save();
  return tournament.data;
});
