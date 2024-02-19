import { nanoid } from 'nanoid';
import { pick } from 'lodash-es';

import { isDev } from "~/server/utils";
import { database, log } from './cosmos';

const key = isDev() ? 'athletes-dev' : 'athletes';
const athletes = database.container(key);

export default class Athlete {
  static async create({ name, region, rank }) {
    const id = nanoid(6);
    const athlete = {
      id,
      name,
      region,
      rank,
    };
    const response = await athletes.items.create(athlete);
    log(`create new athlete with id ${id}`, response);
    return pick(response.resource, ['id', 'name', 'region', 'rank', '_etag']);
  }

  static async update(id, changes, options) {
    try {
      const patchOperations = [];
      Object.keys(changes).forEach(key => {
        patchOperations.push({
          op: 'add',
          path: `/${key}`,
          value: changes[key],
        });
      });
      const response = await athletes.item(id).patch(patchOperations, {
        accessCondition: { type: "IfMatch", condition: options._etag },
      });
      log(`update athlete with id ${id}`, response);
      return pick(response.resource, ['id', 'name', 'region', 'rank', '_etag']);
    } catch (err) {
      if (err.code === 412) {
        throw new Error('athlete out of date, refresh and try again');
      } else {
        throw err;
      }
    }
  }

  static async getAll() {
    const querySpec = { query: 'SELECT c.id, c.name, c.region, c.rank, c._etag from c' };
    try {
      const response = await athletes.items.query(querySpec).fetchAll();
      log('get all athletes', response);
      return response.resources;
    } catch (err) {
      console.log(err);
    }
  }

  static async get(id) {
    const response = await athletes.item(id).read();
    if (response && response.resource) {
      log(`get athlete with id ${id}`, response);
      return pick(response.resource, ['id', 'name', 'region', 'rank', '_etag']);
    }
  }

  static async remove(id) {
    const response = await athletes.item(id).delete();
    log(`delete athlete with id ${id}`, response);
  }
}
