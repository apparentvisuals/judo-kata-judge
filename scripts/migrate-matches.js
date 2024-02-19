import { omit } from 'lodash-es';
import { database, log } from "../server/models/cosmos.js";

const tournamentsDev = database.container('tournaments');
const matchesDev = database.container('matches');

const querySpec = { query: 'SELECT * from c' };
const response = await tournamentsDev.items.query(querySpec).fetchAll();
log('get all tournaments', response);

const normalizedTournaments = response.resources;
for (let tournament of normalizedTournaments) {
  for (let mat of (tournament.mats || [])) {
    for (let group of (mat.groups || [])) {
      for (let match of (group.matches || [])) {
        await _doCreate(group, match);
        delete match.scores;
      }
    }
  }
  const response = await tournamentsDev.items.upsert(tournament);
  log(`updated tournament with id ${response.resource.id}`, response);
}

async function _doCreate(group, match) {
  const newMatch = {
    id: match.id,
    numberOfJudges: group.numberOfJudges,
    completed: match.completed,
  };
  for (let ii = 0; ii < match.scores.length; ii++) {
    newMatch[ii + 1] = match.scores[ii];
  }
  const response = await matchesDev.items.upsert(newMatch);
  log(`add match with id ${response.resource.id}`, response);
}
