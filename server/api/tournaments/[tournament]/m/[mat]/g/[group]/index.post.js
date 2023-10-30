import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const groupNumber = parseInt(getRouterParam(event, 'group'));
  const { numberOfJudges, name, kata, startTime, disableDivideByHalf, disableForgotten, disableMajor } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  tournament.updateGroup(matNumber, groupNumber, { name, kata, numberOfJudges, startTime, disableDivideByHalf, disableForgotten, disableMajor });
  await tournament.save();
  return tournament.data;
});
