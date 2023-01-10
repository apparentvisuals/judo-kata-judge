import { pick } from 'lodash-es';

import db from '../db';


export default defineEventHandler(async (event) => {
  // await db.createTournament('Test Tournament', 1);
  // await db.addMat(5);

  // await db.addMatch(0, 'kgj', 'John Morris', 'Stephen Duran');
  // await db.addMatch(0, 'kgj', 'Matt Roots', 'Drew Roots');
  // await db.addMatch(0, 'jnk', 'Massey Tanaka', 'Francis Au-Yeung');
  // await db.addMatch(0, 'knk', 'Jeremy Le Bris', 'Layton Keely');
  // await db.addMatch(0, 'nnk', 'Reza Nickmanesh', 'Anthony Jewitt');
  // await db.addMatch(0, 'nnk3', 'Sanghoon Lee', 'Jeremy Grant');
  // await db.addMatch(0, 'nnk3', 'Benny Lo', 'Reza Nickmanesh');
  // await db.addMatch(0, 'nnk3', 'Justin Lang', 'Brad Thiel');
  // await db.addMatch(0, 'nnk3', 'Anthony Jewitt', 'Reza Nickmanesh');

  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }

  const mat = parseInt(event.context.params.mat - 1);

  const matInfo = await db.getMat(token, mat);
  if (!matInfo) {
    return {};
  }
  const response = matInfo.matches.map((match) => {
    return pick(match, ['number', 'kata', 'tori', 'uke'])
  });

  return response;
});
