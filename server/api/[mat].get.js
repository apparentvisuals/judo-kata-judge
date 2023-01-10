import { pick } from 'lodash-es';

import db from '../db';

db.createTournament('Test Tournament', 1);
db.addMat(5);

db.addMatch(0, 'kgj', 'John Morris', 'Stephen Duran');
db.addMatch(0, 'kgj', 'Matt Roots', 'Drew Roots');
db.addMatch(0, 'jnk', 'Massey Tanaka', 'Francis Au-Yeung');
db.addMatch(0, 'knk', 'Jeremy Le Bris', 'Layton Keely');
db.addMatch(0, 'nnk', 'Reza Nickmanesh', 'Anthony Jewitt');
db.addMatch(0, 'nnk3', 'Sanghoon Lee', 'Jeremy Grant');
db.addMatch(0, 'nnk3', 'Benny Lo', 'Reza Nickmanesh');
db.addMatch(0, 'nnk3', 'Justin Lang', 'Brad Thiel');
db.addMatch(0, 'nnk3', 'Anthony Jewitt', 'Reza Nickmanesh');


export default defineEventHandler((event) => {
  const mat = parseInt(event.context.params.mat - 1);

  const matInfo = db.getMat(mat);
  if (!matInfo) {
    return {};
  }
  const response = matInfo.matches.map((match) => {
    return pick(match, ['number', 'kata', 'tori', 'uke'])
  });

  return response;
});
