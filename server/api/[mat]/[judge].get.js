import { pick } from 'lodash-es';

import db from '../../db';
import { getToken, moveList } from '../../utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat')) - 1;

  const tournament = await db.tournament(token);
  const matchInfo = tournament.getMatch(mat);
  if (!matchInfo) {
    throw createError({ statusCode: 400, statusMessage: 'no more matches' })
  }

  const judge = parseInt(getRouterParam(event, 'judge')) - 1;
  const judgeInfo = matchInfo.judges[judge];
  return judgeInfo;
});
