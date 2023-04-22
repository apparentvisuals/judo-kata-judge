import { pick } from 'lodash-es';

import db from '../../db';


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

  const matInfo = await db.getMat(token, mat);
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
