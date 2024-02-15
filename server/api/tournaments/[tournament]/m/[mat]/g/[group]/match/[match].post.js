import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const groupNumber = parseInt(getRouterParam(event, 'group'));
  const matchNumber = parseInt(getRouterParam(event, 'match'));
  const { id, tori, toriId, uke, ukeId } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  const updatedMatch = tournament.updateMatch(matNumber, groupNumber, matchNumber, { id, tori, toriId, uke, ukeId });
  if (!updatedMatch) {
    return createError({ statusCode: 400, message: 'data error, match was not updated' });
  }
  await tournament.save();
  return tournament.data;
});
