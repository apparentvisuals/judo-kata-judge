import { pick } from 'lodash-es';

import db from '../../../../../db';
import { getToken } from '../../../../../utils';
import { getAuth } from '../../../../../utils/auth-key';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    throw createError({ statusCode: 401, messsage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    throw createError({ statusCode: 403, messsage: 'forbidden' });
  }

  const tournamentId = getRouterParam(event, 'tournament');
  const mat = parseInt(getRouterParam(event, 'mat'));
  const { numberOfJudges, startTime } = await readBody(event);
  try {
    const tournament = await db.tournament(tournamentId);
    tournament.updateMat(mat, numberOfJudges, startTime);
    await tournament.save();
    return tournament.data;
  } catch (err) {
    switch (err.message) {
      case 'no such tournament found':
        return;
      default:
        sendError(event, createError({ statusCode: 500, messsage: err.message }));
    }
  }

});
