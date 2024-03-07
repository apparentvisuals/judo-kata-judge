import { nanoid } from 'nanoid';
import { pick } from 'lodash-es';

import Tournament from './tournament';
import { shimCreate, shimDelete, shimGet } from './dev-shim';

const EXPIRY_SECONDS = 60 * 60 * 24 * 7;

const KEY = 'invites';

export default class Invite {
  static async create({ tournament }) {
    const id = nanoid(6);
    const ts = Date.now();
    const invite = {
      id,
      tournament,
      exp: ts + (EXPIRY_SECONDS * 1000),
    }
    const data = await shimCreate(KEY, invite);
    return pick(data, ['id', 'tournament', 'exp']);
  }

  static async get(id) {
    const data = await shimGet(KEY, id);
    if (data) {
      return pick(data, ['id', 'tournament', 'exp']);
    }
  }

  static async remove(id) {
    await shimDelete(KEY, id);
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
