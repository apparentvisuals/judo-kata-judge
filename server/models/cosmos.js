import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

const endpoint = 'https://judo-kata-judge.documents.azure.com:443/';
const client = getClient();

export const database = client.database('judo-kata-judge');

function getClient() {
  const key = process.env.COSMOS_KEY;
  if (key) {
    console.log('authenticating cosmos with key');
    return new CosmosClient({ endpoint, key });
  } else {
    console.log('authenticating cosmos with creds');
    const aadCredentials = new DefaultAzureCredential();
    return new CosmosClient({ endpoint, aadCredentials });
  }
}

export function log(message, response) {
  _log(20, message, response ? { rc: response.headers['x-ms-request-charge'] } : {});
}

function _log(level, message, props) {
  console.log(`[${new Date().toISOString()}]${_levelText(level)} ${message} ${_propText(props)}`);
}

function _levelText(level) {
  switch (level) {
    case 10:
      return '[TRACE]';
    case 20:
      return '[DEBUG]';
    case 30:
      return '[INFO] ';
    case 40:
      return '[WARN] ';
    case 50:
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
