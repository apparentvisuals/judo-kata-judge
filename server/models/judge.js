import { pick } from 'lodash-es';

import { isDev, nanoid } from "~/server/utils";
import { database, log } from './cosmos';

const key = isDev() ? 'judges-dev' : 'judges';
const judges = database.container(key);


export default class Judge {
  static async create({ name, region, rank }) {
    const id = nanoid(4);
    const judge = {
      id,
      name,
      region,
      rank,
    };
    const response = await judges.items.create(judge);
    log(`create new judge with id ${id}`, response);
    return pick(response.resource, ['id', 'name', 'region', 'rank', '_etag']);
  }

  static async update(id, changes, options) {
    try {
      const patchOperations = [];
      Object.keys(changes).forEach(key => {
        patchOperations.push({
          op: 'replace',
          path: `/${key}`,
          value: changes[key],
        });
      });
      const response = await judges.item(id).patch(patchOperations, {
        accessCondition: { type: "IfMatch", condition: options._etag },
      });
      log(`update judge with id ${id}`, response);
      return pick(response.resource, ['id', 'name', 'region', 'rank', '_etag']);
    } catch (err) {
      if (err.code === 412) {
        throw new Error('judge out of date, refresh and try again');
      } else {
        throw err;
      }
    }
  }

  static async getAll() {
    const querySpec = { query: 'SELECT c.id, c.name, c.region, c.rank, c._etag from c' };
    try {
      const response = await judges.items.query(querySpec).fetchAll();
      log('get all judges', response);
      return response.resources;
    } catch (err) {
      console.log(err);
    }
  }

  static async get(id) {
    const response = await judges.item(id).read();
    if (response && response.resource) {
      log(`get judge with id ${id}`, response);
      return pick(response.resource, ['id', 'name', 'region', 'rank', '_etag']);
    }
  }

  static async remove(id) {
    const response = await judges.item(id).delete();
    log(`delete judge with id ${id}`, response);
  }
}
