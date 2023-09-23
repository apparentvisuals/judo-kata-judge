import Tournament from '~/server/models/tournament';
import db from '../../../db';
import { getToken } from '../../../utils';
import { getAuth } from '../../../utils/auth-key';

export default defineEventHandler(async (event) => {
  try {
    const tournamentId = getRouterParam(event, 'tournament');
    const tournament = await Tournament.get(tournamentId);
    return tournament.data;
  } catch (err) {
    throw createError({ statusCode: 400, messsage: err.message });
  }

});
