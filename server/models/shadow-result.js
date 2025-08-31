import { pick } from 'lodash-es';

import { warn } from './cosmos';
import { shimCreate, shimDelete, shimGet, shimUpdate, shimUpsert } from './dev-shim';

const KEY = 'shadow-results';

export default class ShadowResult {
  static async create({ id, name, scores }) {
    const match = {
      id,
      name,
      scores,
    };
    await shimCreate(KEY, match);
  }

  static async get(id) {
    const data = await shimGet(KEY, id);
    if (data) {
      return pick(data, ['id', 'name', 'scores']);
    }
  }

  static async remove(id) {
    return await shimDelete(KEY, id);
  }
}
