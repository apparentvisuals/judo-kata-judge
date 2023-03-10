import { pick } from 'lodash-es';

import db from '../../db';
import { isDev } from '../../utils';

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }
  const { mat, numberOfJudges } = await readBody(event);
  try {
    const tournament = await db.tournament(token);
    tournament.updateMat(mat, numberOfJudges);
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
