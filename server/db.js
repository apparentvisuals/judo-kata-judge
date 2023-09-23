

import Clients from './clients';

const clients = new Map();

class DB {
  /**
   * 
   * @param {string} key format {tournamentCode}-{matNumber}
   */
  clients(key) {
    if (!clients.has(key)) {
      clients.set(key, {
        match: new Clients(),
        report: new Clients(),
        summary: new Clients(),
      });
    }
    return clients.get(key);
  }
}

export default new DB();
