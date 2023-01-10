import { pick } from 'lodash-es';

import db from '../../db';
import { moveList } from '../../utils';

export default defineEventHandler((event) => {
  const mat = parseInt(event.context.params.mat - 1);

  const matchInfo = db.getMatch(mat);
  if (!matchInfo) {
    return {};
  }
  const response = pick(matchInfo, ['number', 'kata', 'tori', 'uke']);
  response.moveList = moveList(matchInfo.kata);
  return response;
});
