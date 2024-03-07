import { pick } from 'lodash-es';

import { warn } from './cosmos';
import { shimCreate, shimDelete, shimGet, shimUpdate } from './dev-shim';

const KEY = 'matches';

export default class Match {
  static async create(id) {
    const match = {
      id,
      completed: false,
    };
    const data = await shimCreate(KEY, match);
    return pick(data, ['id', 'completed', '_etag']);
  }

  static async update(id, changes, options) {
    options = options || {};
    try {
      const data = await shimUpdate(KEY, id, changes, options);
      return pick(data, ['id', 'name', 'numberOfJudges', '1', '2', '3', '4', '5', 'completed', '_etag']);
    } catch (err) {
      if (err.code === 412) {
        warn(`attempted to update out of date match ${id} with etag ${options._etag}`);
        throw new Error('match out of date, refresh and try again');
      } else {
        throw err;
      }
    }
  }

  static async get(id) {
    const data = await shimGet(KEY, id);
    if (data) {
      return pick(data, ['id', 'name', 'numberOfJudges', '1', '2', '3', '4', '5', 'completed', '_etag']);
    }
  }

  static async remove(id) {
    return await shimDelete(KEY, id);
  }
}
