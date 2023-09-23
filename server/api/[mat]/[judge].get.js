
import Tournament from '~/server/models/tournament';
import { getToken } from '../../utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat')) - 1;

  const tournament = await Tournament.get(token);
  const matchInfo = tournament.getMatch(mat);
  if (!matchInfo) {
    throw createError({ statusCode: 400, message: 'no more matches' })
  }

  const judge = parseInt(getRouterParam(event, 'judge')) - 1;
  const judgeInfo = matchInfo.judges[judge];
  return judgeInfo;
});
