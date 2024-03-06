import { isDev } from "../utils";
import { database, log } from './cosmos';
import { omit, omitBy, isNil } from 'lodash-es';

const useShim = true;

export async function shimGet(key, id) {
  if (isDev()) {
    if (useShim) {
      const value = await useStorage(`${key}-dev`).getItem(id);
      log(`get ${key} with id ${id}`);
      return { id, ...value, _etag: '1' };
    } else {
      const container = database.container(`${key}-dev`);
      const response = await container.item(id).read();
      log(`get ${key} with id ${id}`, response);
      return response.resources;
    }
  } else {
    const container = database.container(key);
    const response = await container.item(id).read();
    log(`get ${key} with id ${id}`, response);
    return response.resources;
  }
}

export async function shimGetAll(key, querySpec) {
  if (isDev()) {
    if (useShim) {
      const keys = await useStorage(`${key}-dev`).getKeys();
      const itemsP = keys.map((id) => {
        return (async () => {
          const data = await useStorage(`${key}-dev`).getItem(id);
          return { id, ...data, _etag: '1' };
        })();
      });
      const items = await Promise.all(itemsP);
      log(`get all ${key}`);
      return items;
    } else {
      const container = database.container(`${key}-dev`);
      const response = await container.items.query(querySpec).fetchAll();
      log(`get all ${key}`, response.resources);
      return response.resources;
    }
  } else {
    const container = database.container(key);
    const response = await container.items.query(querySpec).fetchAll();
    log(`get all ${key}`, response.resources);
    return response.resources;
  }
}

export async function shimCreate(key, data) {
  const id = data.id;
  if (isDev()) {
    if (useShim) {
      await useStorage(`${key}-dev`).setItem(id, omit(data, 'id'));
      log(`create new ${key} with id ${id}`);
      return { ...data, _etag: '1' };
    } else {
      const container = database.container(`${key}-dev`);
      const response = await container.items.create(data);
      log(`create new ${key} with id ${id}`, response.resources);
      return response.resources;
    }
  } else {
    const container = database.container(key);
    const response = await container.items.create(data);
    log(`create new ${key} with id ${id}`, response.resources);
    return response.resources;
  }
}

export async function shimUpdate(key, id, data, options) {
  const changes = omitBy(data, isNil);
  if (isDev()) {
    if (useShim) {
      const oldData = await useStorage(`${key}-dev`).getItem(id);
      Object.keys(changes).forEach(key => {
        oldData[key] = changes[key];
      });
      await useStorage(`${key}-dev`).setItem(id, oldData);
      log(`update ${key} with id ${id}`);
      return { id, ...oldData, _etag: '1' };
    } else {
      const patchOperations = [];
      Object.keys(changes).forEach(key => {
        patchOperations.push({
          op: 'replace',
          path: `/${key}`,
          value: changes[key],
        });
      });
      const container = database.container(`${key}-dev`);
      const response = await container.item(id).patch(patchOperations, {
        accessCondition: { type: "IfMatch", condition: options._etag },
      });
      log(`update ${key} with id ${id}`, response);
      return response.resource;
    }
  } else {
    const patchOperations = [];
    Object.keys(changes).forEach(key => {
      patchOperations.push({
        op: 'replace',
        path: `/${key}`,
        value: changes[key],
      });
    });
    const container = database.container(key);
    const response = await container.item(id).patch(patchOperations, {
      accessCondition: { type: "IfMatch", condition: options._etag },
    });
    log(`update ${key} with id ${id}`, response);
    return response.resource;
  }
}

export async function shimDelete(key, id) {
  if (isDev()) {
    if (useShim) {
      await useStorage(`${key}-dev`).removeItem(id);
      log(`delete ${key} with id ${id}`);
    } else {
      const container = database.container(`${key}-dev`);
      const response = await container.item(id).delete();
      log(`delete ${key} with id ${id}`, response);
    }
  } else {
    const container = database.container(key);
    const response = await container.item(id).delete();
    log(`delete ${key} with id ${id}`, response);
  }
}
