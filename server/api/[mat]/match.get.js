import { pick } from 'lodash-es';

import db from '../../db';
import { getToken, moveList } from '../../utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(event.context.params.mat - 1);

  const tournament = await db.tournament(token);
  const matchInfo = tournament.getMatch(mat);
  if (!matchInfo) {
    throw createError({ statusCode: 400, statusMessage: 'no more matches' })
  }
  const response = pick(matchInfo, ['number', 'kata', 'tori', 'uke']);
  return response;
});
