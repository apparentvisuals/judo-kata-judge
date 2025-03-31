import { pick } from 'lodash-es';

import { nanoid } from "~/server/utils";
import { shimCreate, shimDelete, shimGet, shimGetAll, shimUpdate } from './dev-shim';

const KEY = 'judges';

export default class Judge {
  static async create({ name, region, rank }) {
    const id = nanoid(4);
    const judge = {
      id,
      name,
      region,
      rank,
      nnk,
      knk,
      jnk,
      kgj,
      kink,
      konk,
      ink,
    };
    const data = await shimCreate(KEY, judge);
    return pick(data, ['id', 'name', 'region', 'rank', 'nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink', '_etag']);
  }

  static async update(id, changes, options) {
    try {
      const data = await shimUpdate(KEY, id, changes, options);
      return pick(data, ['id', 'name', 'region', 'rank', 'nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink', '_etag']);
    } catch (err) {
      if (err.code === 412) {
        throw new Error('judge out of date, refresh and try again');
      } else {
        throw err;
      }
    }
  }

  static async getAll() {
    const querySpec = { query: 'SELECT c.id, c.name, c.region, c.rank, c.nnk, c.knk, c.jnk, c.kgj, c.kink, c.konk, c.ink, c._etag from c' };
    return await shimGetAll(KEY, querySpec);
  }

  static async get(id) {
    const data = await shimGet(KEY, id);
    if (data) {
      return pick(data, ['id', 'name', 'region', 'rank', 'nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink', '_etag']);
    }
  }

  static async remove(id) {
    return await shimDelete(KEY, id);
  }
}
