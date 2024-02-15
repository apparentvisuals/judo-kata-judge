import { omit } from 'lodash-es';
import { database, log } from "../server/models/cosmos.js";

const athletes = database.container('athletes');
const athletesDev = database.container('athletes-dev');

const querySpec = { query: 'SELECT c.id, c["value"] from c' };
const response = await athletes.items.query(querySpec).fetchAll();
log('get all athletes', response);
const normalizedAthletes = response.resources.map(athlete => {
  const value = JSON.parse(athlete.value);
  return Object.assign({}, athlete, value);
});
log(normalizedAthletes);
await Promise.all(normalizedAthletes.map(athlete => _doCreate(athlete)));


async function _doCreate(athlete) {
  const response = await athletes.items.upsert(omit(athlete, 'value'));
  log(`moved athlete with id ${response.resource.id}`, response);
}
