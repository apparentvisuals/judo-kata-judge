import { omit } from 'lodash-es';
import { database, log } from "../server/models/cosmos.js";

const invites = database.container('invites');
const invitesDev = database.container('invites-dev');

const querySpec = { query: 'SELECT * from c' };
const response = await invites.items.query(querySpec).fetchAll();
log('get all invites', response);
const normalizedInvites = response.resources.map(invite => {
  return invite;
});
log(normalizedInvites);
await Promise.all(normalizedInvites.map(invite => _doCreate(invite)));


async function _doCreate(invite) {
  const response = await invitesDev.items.upsert(invite);
  log(`moved invite with id ${response.resource.id}`, response);
}
