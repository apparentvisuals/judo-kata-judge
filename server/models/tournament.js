import { nanoid } from 'nanoid';
import { pick } from 'lodash-es';

import { createReport, isDev, matchDataToScores } from '~/server/utils';
import { database, log } from './cosmos';
import Match from './match';

const key = isDev() ? 'tournaments-dev' : 'tournaments';
const tournaments = database.container(key);

// const key = 'tournament';
/**
 * {
 *   id: string
 *   name: string
 *   org: string
 *   numberOfMats: number
 *   showJudgeTotals: boolean
 *   mats: [{
 *     groups: [{
 *       numberOfJudges: number
 *       startTime: string
 *       matches: [{
 *         kata: string
 *         tori: string
 *         uke: string
 *         numberOfJudges: number
 *         completed: boolean
 *         judges: [{
 *           id: string
 *           scores: []
 *         }]
 *       }]
 *     }]
 *   }]
 * }
 */
export default class Tournament {
  #id;
  #tournament;
  #etag;
  constructor(id, data, etag) {
    this.#id = id;
    this.#tournament = pick(data, ['id', 'name', 'org', 'showJudgeTotals', 'mats', 'invites', 'value']);
    this.#etag = etag;
  }

  static async create({ name = 'Tournament 1', org, showJudgeTotals = true }) {
    const id = nanoid(6);
    const tournamentData = {
      id,
      name,
      org,
      showJudgeTotals,
      mats: [],
      invites: {},
    };
    const response = await tournaments.items.create(tournamentData);
    log(`create new tournament with id ${id}`, response);
    return response.resource;
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
      const response = await tournaments.item(id).patch(patchOperations, {
        accessCondition: { type: "IfMatch", condition: options._etag },
      });
      log(`update tournament with id ${id}`, response);
      return response.resource;
    } catch (err) {
      if (err.code === 412) {
        log(`attemped to update out of date tournament ${id} with etag ${options._etag}`);
        throw new Error('tournament out of date, refresh and try again');
      } else {
        throw err;
      }
    }
  }

  static async getAll(options) {
    const querySpec = _getAllQuery(options);
    try {
      const response = await tournaments.items.query(querySpec).fetchAll();
      log('get all tournaments', response);
      return response.resources;
    } catch (err) {
      console.log(err);
    }
  }

  static async get(id) {
    const response = await tournaments.item(id).read();
    if (response && response.resource) {
      log(`get tournament with id ${id}`, response);
      return new Tournament(id, response.resource, response.resource._etag);
    }
  }

  static async remove(id) {
    const response = await tournaments.item(id).delete();
    log(`delete tournament with id ${id}`, response);
  }

  getMat(matNumber) {
    const mat = this.#tournament.mats[matNumber];
    return mat;
  }

  createMat() {
    if (!this.#tournament.mats) {
      this.#tournament.mats = [];
    }
    this.#tournament.mats.push({ groups: [] });
  }

  deleteMat(index) {
    this.#tournament.mats.splice(index, 1);
  }

  addInvite(invite, data = {}) {
    if (!this.#tournament.invites) {
      this.#tournament.invites = {};
    }
    this.#tournament.invites[invite] = data;
  }

  deleteInvite(invite) {
    delete this.#tournament.invites[invite];
  }

  createGroup(mat, data) {
    const group = { id: nanoid(4), matches: [] };
    this.#assignGroupValues(group, data);
    this.#tournament.mats[mat].groups.push(group);
  }

  getGroup(matNumber, groupNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    return group;
  }

  updateGroup(matNumber, groupNumber, data) {
    const group = this.getGroup(matNumber, groupNumber);
    if (!data.id || data.id !== group.id) {
      return;
    }
    this.#assignGroupValues(group, data);
    return group;
  }

  deleteGroup(mat, group) {
    this.#tournament.mats[mat].groups.splice(group, 1);
  }

  getMatch(matNumber, groupNumber, matchNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const match = group.matches[matchNumber];
    return {
      tName: this.#tournament.name,
      org: this.#tournament.org,
      id: match.id,
      name: group.name,
      kata: group.kata,
      numberOfJudges: group.numberOfJudges,
      uke: match.uke,
      tori: match.tori,
    };
  }

  getNextMatch(matNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    for (const [groupIndex, group] of mat.groups.entries()) {
      for (const [index, match] of group.matches.entries()) {
        if (!match.completed) {
          const combinedMatch = {
            id: match.id,
            name: group.name,
            kata: group.kata,
            numberOfJudges: group.numberOfJudges,
            disableDivideByHalf: group.disableDivideByHalf,
            disableForgotten: group.disableForgotten,
            disableMajor: group.disableMajor,
            uke: match.uke,
            tori: match.tori,
            scores: match.scores,
          };
          return { match: combinedMatch, group, index, groupIndex };
        }
      }
    }
    return {};
  }

  createMatch(matNumber, groupNumber, { tori, toriId, uke, ukeId }) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const matches = group.matches;
    const match = {
      id: nanoid(),
      tori,
      toriId,
      uke,
      ukeId,
      completed: false,
    };
    matches.push(match);
    return match;
  }

  async updateMatch(matNumber, groupNumber, matchNumber, { id, tori, toriId, uke, ukeId, completed, summary }) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const match = group.matches[matchNumber];
    if (!match) {
      return;
    }
    if (!id || id !== match.id) {
      return;
    }
    if (match.completed) {
      return;
    }
    if (tori != null) {
      match.tori = tori;
      match.toriId = toriId;
    }
    if (uke != null) {
      match.uke = uke;
      match.ukeId = ukeId;
    }
    if (completed != null) {
      match.completed = completed;
    }
    if (summary != null) {
      match.summary = summary;
    }
    return match;
  }

  deleteMatch(matNumber, groupNumber, matchNumber) {
    const mat = this.#tournament.mats[matNumber];
    if (!mat) {
      return;
    }
    const group = mat.groups[groupNumber];
    if (!group) {
      return;
    }
    const matches = group.matches;
    return matches.splice(matchNumber, 1)[0];
  }

  get id() {
    return this.#id;
  }

  get data() {
    return { ...this.#tournament, id: this.#id, _etag: this.#etag };
  }

  async save() {
    const response = await tournaments.items.upsert({ id: this.#id, ...this.#tournament }, {
      accessCondition: { type: "IfMatch", condition: this.#etag },
    });
    log(`update tournament with id ${this.#id}`, response);
  }

  update(tournament) {
    this.#tournament.name = tournament.name;
    this.#tournament.org = tournament.org;
    this.#tournament.showJudgeTotals = tournament.showJudgeTotals;
    if (tournament.mats) {
      this.#tournament.mats = tournament.mats;
    }
  }

  replace(tournament) {
    this.#tournament = tournament;
  }

  #assignGroupValues(group, { name, kata, numberOfJudges, startTime, disableDivideByHalf, disableForgotten, disableMajor }) {
    if (name != null) {
      group.name = name;
    }
    if (kata) {
      group.kata = kata;
    }
    if (numberOfJudges) {
      group.numberOfJudges = parseInt(numberOfJudges);
    }
    if (startTime != null) {
      group.startTime = startTime;
    }
    if (disableDivideByHalf != null) {
      group.disableDivideByHalf = disableDivideByHalf;
    }
    if (disableForgotten != null) {
      group.disableForgotten = disableForgotten;
    }
    if (disableMajor != null) {
      group.disableMajor = disableMajor;
    }
  }
}

function _defaultScores() {
  return Array(5).fill({});
}

function _getAllQuery(options) {
  if (options.org) {
    return {
      query: 'SELECT c.id, c.name, c.org, c.showJudgeTotals, c._etag FROM c WHERE c.org = @org',
      parameters: [
        {
          name: '@org',
          value: options.org,
        },
      ],
    };
  } else {
    return { query: 'SELECT c.id, c.name, c.org, c.showJudgeTotals, c._etag FROM c' };
  }
}
