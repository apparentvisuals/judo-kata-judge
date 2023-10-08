import { nanoid } from 'nanoid';

import { isDev } from "../utils";

const key = isDev() ? 'athlete-dev' : 'athlete';
export default class Athlete {
  static async create(data) {
    const id = nanoid(6);
    const athlete = data;
    await useStorage(key).setItem(id, athlete);
    return { id, ...athlete };
  }

  static async update(id, data) {
    const athlete = data;
    await useStorage(key).setItem(id, athlete);
    return { id, ...athlete };
  }

  static async getAll() {
    const athleteIds = await useStorage(key).getKeys();
    const loadAthletes = athleteIds.map((id) => {
      return (async () => {
        const athlete = await useStorage(key).getItem(id);
        return { id, name: athlete.name, region: athlete.region, rank: athlete.rank };
      })();
    });
    const athletes = await Promise.all(loadAthletes);
    return athletes;
  }

  static async remove(id) {
    await useStorage(key).removeItem(id);
  }
}
