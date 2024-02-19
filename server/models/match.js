import { pick } from 'lodash-es';

import { isDev } from "~/server/utils";
import { database, log, warn } from './cosmos';

const key = isDev() ? 'matches-dev' : 'matches';
const matches = database.container(key);

export default class Match {
  static async create(id) {
    const match = {
      id,
      completed: false,
    };
    const response = await matches.items.create(match);
    log(`create new match with id ${id}`, response);
    return pick(response.resource, ['id', 'completed', '_etag']);
  }

  static async update(id, changes, options) {
    options = options || {};
    try {
      const patchOperations = [];
      Object.keys(changes).forEach(key => {
        patchOperations.push({
          op: 'add',
          path: `/${key}`,
          value: changes[key],
        });
      });
      const opOptions = {};
      if (options._etag) {
        opOptions.accessCondition = { type: "IfMatch", condition: options._etag };
      }
      const response = await matches.item(id).patch(patchOperations, opOptions);
      log(`update match with id ${id}`, response);
      return response.resource;
    } catch (err) {
      if (err.code === 412) {
        warn(`attemped to update out of date match ${id} with etag ${options._etag}`);
        throw new Error('match out of date, refresh and try again');
      } else {
        throw err;
      }
    }
  }

  static async get(id) {
    const response = await matches.item(id).read();
    if (response && response.resource) {
      log(`get match with id ${id}`, response);
      return pick(response.resource, ['id', 'name', 'numberOfJudges', '1', '2', '3', '4', '5', 'completed', '_etag']);
    }
  }

  static async remove(id) {
    const response = await matches.item(id).delete();
    log(`delete athlete with id ${id}`, response);
  }
}
