import { omit } from 'lodash-es';
import { database, log } from "../server/models/cosmos.js";

const judges = database.container('judges');
const judgesDev = database.container('judges-dev');

const querySpec = { query: 'SELECT c.id, c["value"] from c' };
const response = await judges.items.query(querySpec).fetchAll();
log('get all judges', response);
const normalizedJudges = response.resources.map(judge => {
  const value = JSON.parse(judge.value);
  return Object.assign({}, judge, value);
});
log(normalizedJudges);
await Promise.all(normalizedJudges.map(judge => _doCreate(judge)));


async function _doCreate(judge) {
  const response = await judges.items.upsert(omit(judge, 'value'));
  log(`moved judge with id ${response.resource.id}`, response);
}
