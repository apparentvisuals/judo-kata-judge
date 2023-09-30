import { nanoid } from 'nanoid';

import { isDev } from "../utils";

const key = isDev() ? 'judge-dev' : 'judge';

export default class Judge {
  static async create(data) {
    const id = nanoid(6);
    const judge = data;
    await useStorage(key).setItem(id, judge);
    return { id, ...judge };
  }

  static async get(id) {
    const judge = await useStorage(key).getItem(id);
    if (judge) {
      return { id, ...judge };
    }
  }

  static async getAll() {
    const judgeIds = await useStorage(key).getKeys();
    const loadJudges = judgeIds.map((id) => {
      return (async () => {
        const judge = await Judge.get(id);
        return { id, name: judge.name, region: judge.region, rank: judge.rank };
      })();
    });
    const judges = await Promise.all(loadJudges);
    return judges;
  }

  static async remove(id) {
    await useStorage(key).removeItem(id);
  }
}
