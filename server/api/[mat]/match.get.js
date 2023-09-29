import { pick } from 'lodash-es';

import { getToken } from '../../utils';
import Tournament from '~/server/models/tournament';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat'));

  const tournament = await Tournament.get(token);
  const matchInfo = tournament.getMatch(mat);
  if (!matchInfo) {
    throw createError({ statusCode: 400, message: 'no more matches' })
  }
  const response = pick(matchInfo, ['number', 'kata', 'tori', 'uke']);
  return response;
});
