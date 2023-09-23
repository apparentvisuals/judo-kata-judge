import { pick } from 'lodash-es';

import Tournament from '~/server/models/tournament';


export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }

  const mat = parseInt(getRouterParam(event, 'mat')) - 1;

  const tournament = await Tournament.get(token);
  const matInfo = tournament.getMat(mat);
  if (!matInfo) {
    return {};
  }
  const response = {
    startTime: matInfo.startTime,
    matches: matInfo.matches.map((match) => {
      return pick(match, ['number', 'kata', 'tori', 'uke'])
    }),
  }

  return response;
});
