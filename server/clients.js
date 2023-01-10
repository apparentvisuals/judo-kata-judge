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
    return this.#clients.delete(id);
  }
  get count() {
    return this.#numberOfClients;
  }
  get list() {
    return this.#clients.values();
  }
}
