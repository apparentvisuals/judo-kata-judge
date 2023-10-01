
import Tournament from '~/server/models/tournament';
import { getToken } from '../../utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat'));
  const judge = parseInt(getRouterParam(event, 'judge')) - 1;

  const tournament = await Tournament.get(token);
  const { match, index } = tournament.getMatch(mat);
  if (!match) {
    return createError({ statusCode: 404, message: 'no more matches' })
  }
  return match.scores[judge];
});
