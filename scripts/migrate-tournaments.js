import { omit } from 'lodash-es';
import { database, log } from "../server/models/cosmos.js";

const tournaments = database.container('tournaments');
const tournamentsDev = database.container('tournaments-dev');

const querySpec = { query: 'SELECT c.id, c["value"] from c' };
const response = await tournaments.items.query(querySpec).fetchAll();
log('get all tournaments', response);
const normalizedTournaments = response.resources.map(tournament => {
  const value = JSON.parse(tournament.value);
  return Object.assign({}, tournament, value);
});
log(normalizedTournaments);
await Promise.all(normalizedTournaments.map(tournament => _doCreate(tournament)));


async function _doCreate(tournament) {
  const response = await tournaments.items.upsert(omit(tournament, 'value'));
  log(`moved tournament with id ${response.resource.id}`, response);
}
