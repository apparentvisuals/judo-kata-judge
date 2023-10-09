import { pick } from 'lodash-es';

import { getToken } from '~/server/utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat'));

  const tournament = await Tournament.get(token);
  const { match, index } = tournament.getMatch(mat);
  if (!match) {
    return createError({ statusCode: 404, statusMessage: 'no more matches' })
  }
  const response = pick(match, ['kata', 'tori', 'uke', 'numberOfJudges']);
  response.index = index;
  return response;
});
