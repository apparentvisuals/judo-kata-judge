import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

const TRACE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const client = getClient();
function getClient() {
  if (key) {
    info('authenticating cosmos with key');
    return new CosmosClient({ endpoint, key });
  } else {
    info('authenticating cosmos with creds');
    const aadCredentials = new DefaultAzureCredential();
    return new CosmosClient({ endpoint, aadCredentials });
  }
}

export const database = client.database('judo-kata-judge');
export function log(message, response) {
  console.debug(_log(DEBUG, message, response ? { rc: response.headers['x-ms-request-charge'] } : {}));
}
export function info(message, response) {
  console.info(_log(INFO, message, response ? { rc: response.headers['x-ms-request-charge'] } : {}));
}
export function warn(message, response) {
  console.warn(_log(WARN, message, response ? { rc: response.headers['x-ms-request-charge'] } : {}));
}
export function error(message, response) {
  console.error(_log(ERROR, message, response ? { rc: response.headers['x-ms-request-charge'] } : {}));
}

function _log(level, message, props) {
  return `[${new Date().toISOString()}]${_levelText(level)} ${message} ${_propText(props)}`;
}

function _levelText(level) {
  switch (level) {
    case TRACE:
      return '[TRACE]';
    case DEBUG:
      return '[DEBUG]';
    case INFO:
      return '[INFO] ';
    case WARN:
      return '[WARN] ';
    case ERROR:
      return '[ERROR]';
  }
}

function _propText(props) {
  let strings = [];
  Object.keys(props || {}).forEach(key => {
    strings.push(`${key}=${props[key]}`);
  });
  return strings.join(' ');
}
