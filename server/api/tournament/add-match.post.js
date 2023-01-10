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

  const { mat, kata, tori, uke } = await readBody(event);
  const tournament = await db.tournament(token);
  tournament.addMatch(mat, kata, tori, uke);
  await tournament.save();
  return tournament.data;
});
