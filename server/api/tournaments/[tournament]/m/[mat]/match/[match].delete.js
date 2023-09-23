import Tournament from '~/server/models/tournament';
import db from '../../../../../../db';
import { getToken } from '../../../../../../utils';
import { getAuth } from '../../../../../../utils/auth-key';

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
  const matchNumber = parseInt(getRouterParam(event, 'match'));
  const tournament = await Tournament.get(tournamentId);
  tournament.deleteMatch(matNumber, matchNumber);
  await tournament.save();
  return tournament.data;
});
