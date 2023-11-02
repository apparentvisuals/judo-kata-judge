

import Clients from './clients';
import Notify from './notify';

const clients = new Map();
const notifications = new Map();

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

  /**
   * 
   * @param {string} key 
   * @returns {Notify}
   */
  notifications(key) {
    if (!notifications.has(key)) {
      notifications.set(key, new Notify());
    }
    return notifications.get(key);
  }
}

export default new DB();
