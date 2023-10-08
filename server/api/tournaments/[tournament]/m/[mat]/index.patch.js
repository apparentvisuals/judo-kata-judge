import { pick } from 'lodash-es';

import db from '../../../../../db';
import { getToken } from '../../../../../utils';
import { getAuth } from '../../../../../utils/auth-key';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, statusMessage: 'forbidden' });
  }

  const tournamentId = getRouterParam(event, 'tournament');
  const mat = parseInt(getRouterParam(event, 'mat'));
  const { numberOfJudges, startTime } = await readBody(event);
  try {
    const tournament = await Tournament.get(tournamentId);
    tournament.updateMat(mat, numberOfJudges, startTime);
    await tournament.save();
    return tournament.data;
  } catch (err) {
    switch (err.message) {
      case 'no such tournament found':
        return;
      default:
        sendError(event, createError({ statusCode: 500, statusMessage: err.message }));
    }
  }

});
