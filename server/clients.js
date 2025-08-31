export default class Clients {
  #numberOfClients = 0
  #clients = new Map();

  add(id, res) {
    this.#numberOfClients ++;
    this.#clients.set(id, res);
  }

  get(id) {
    return this.#clients.get(id);
  }

  remove(id) {
    this.#numberOfClients --;
    const res = this.#clients.get(id);
    if (res) res.end();
    return this.#clients.delete(id);
  }

  close() {
    console.log(`closing ${this.#numberOfClients} connections`);
    this.list.forEach((res) => { if (res) res.end() });
    this.#clients.clear();
  }

  get count() {
    return this.#numberOfClients;
  }
  get list() {
    return this.#clients.values();
  }
}
