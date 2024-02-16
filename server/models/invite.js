import { nanoid } from 'nanoid';
import { pick } from 'lodash-es';

import { isDev } from "~/server/utils";
import { database, log } from './cosmos';
import Tournament from './tournament';

const EXPIRY_SECONDS = 60 * 60 * 24 * 7;

const key = isDev() ? 'invites-dev' : 'invites';
const invites = database.container(key);

export default class Invite {
  static async create({ tournament }) {
    const id = nanoid(6);
    const ts = Date.now();
    const invite = {
      id,
      tournament,
      exp: ts + (EXPIRY_SECONDS * 1000),
    }
    const response = await invites.items.create(invite);
    log(`create new invite with id ${id}`, response);
    return pick(response.resource, ['id', 'tournament', 'exp']);
  }

  static async get(id) {
    const response = await invites.item(id).read();
    if (response && response.resource) {
      log(`get invite with id ${id}`, response);
      return pick(response.resource, ['id', 'tournament', 'exp']);
    }
    return {};
  }

  static async remove(id) {
    const response = await invites.item(id).delete();
    log(`delete invite with id ${id}`, response);
  }

  static async getTournament(id) {
    const { tournament: tId } = await Invite.get(id);
    if (!tId) {
      throw new Error('Invite link has expired');
    }
    // optionally check exp here
    const tournament = await Tournament.get(tId);
    if (!tournament) {
      return createError({ statusCode: 404, message: 'Invite link has expired.' });
    }
    return tournament;
  }
}
