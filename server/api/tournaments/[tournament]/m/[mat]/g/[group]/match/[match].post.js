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
  const matchNumber = parseInt(getRouterParam(event, 'match'));
  const { tori, toriId, uke, ukeId } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  tournament.updateMatch(matNumber, groupNumber, matchNumber, { tori, toriId, uke, ukeId });
  await tournament.save();
  return tournament.data;
});
