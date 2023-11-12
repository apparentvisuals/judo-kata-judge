import { nanoid } from 'nanoid';

import { isDev } from "~/server/utils";

const EXPIRY_SECONDS = 60 * 60 * 24 * 7;

const key = isDev() ? 'invite-dev' : 'invite';
export default class Invite {
  static async create(data) {
    const id = nanoid(6);
    const ts = Date.now();
    data.exp = ts + (EXPIRY_SECONDS * 1000);
    await useStorage(key).setItem(id, data);
    return { id, data };
  }

  static async get(id) {
    const data = await useStorage(key).getItem(id);
    return { id, data };
  }

  static async getAll() {
    const inviteIds = await useStorage(key).getKeys();
    const loadInvites = inviteIds.map((id) => {
      return Invite.get(id);
    });
    const invites = await Promise.all(loadInvites);
    return invites;
  }

  static async remove(id) {
    await useStorage(key).removeItem(id);
  }
}
