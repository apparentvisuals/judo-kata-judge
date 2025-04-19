
import data from './data.json' with { type: 'json' };
import kataData from './kata.json' with { type: 'json' };

export const ORG_MAP = data.organizations;
export const ORG_IMAGE_MAP = data.organizationImages;
export const PROVINCE_MAP = data.provinces;
export const LEVEL_MAP = data.judgeLevels;
export const RANK_MAP = data.athleteRanks;

export const KATA_MAP = kataData.kataNames;

export function getOrganization(org) {
  if (org) {
    return ORG_MAP[org] || '';
  }
  return '';
}

export function getOrganizationImage(org) {
  if (org) {
    return ORG_IMAGE_MAP[org] || '';
  }
  return '';
}

export function groupedMoveList(kata) {
  return legacyMoveList(kata).map((move) => {
    const parts = move.split(':');
    return { g: parts[0], t: parts[1] };
  });
}

export function moveList(kata) {
  return legacyMoveList(kata).map((move) => {
    const parts = move.split(':');
    if (parts.length > 1) {
      return parts[1];
    } else {
      return parts[0];
    }
  });
}

function legacyMoveList(kata) {
  return kataData[kata] || [];
}

export function duration(kata) {
  switch (kata) {
    case 'nnk3':
      return 5;
    case 'nnk':
      return 8;
    case 'knk':
      return 10;
    case 'jnk':
      return 9;
    case 'kgj':
      return 8;
    case 'kink':
      return 11;
    case 'ko1':
    case 'ko2':
    case 'ko3':
    case 'ko4':
    case 'ko5':
    case 'ko6':
    case 'ko7':
      return 3;
    default:
      return 0;
  }
}

export function getGroupName(group) {
  if (group.name) {
    return `${group.name} (${getKataName(group.kata)})`;
  }
  if (group.kata) {
    return getKataName(group.kata);
  }
}

export function getKataName(kata) {
  return KATA_MAP[kata] || '';
};

export function getProvinceName(code) {
  return PROVINCE_MAP[code] || '';
}

export function getLevelName(code) {
  if (code) {
    return LEVEL_MAP[code] || '';
  }
  return '';
}

export function getRankName(code) {
  return RANK_MAP[code] || '';
}

export function handleServerError(err) {
  if (err.response) {
    return err.response._data.message;
  } else {
    return err.statusMessage || err.message;
  }
}

export function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function calculateHasMajor(scores) {
  let hasMajor = scores.some((score) => {
    if (score.deductions) {
      const deductions = typeof score.deductions === 'string' ? score.deductions.split(':') : score.deductions;
      return deductions[4] === '1';
    }
  });
  return hasMajor;
}

/**
 * 
 * @param {Array<string>} deductions array of empty, 1 or + or - for deductions
 * @returns {number} total
 */
export function calculateMoveScore(deductions) {
  let total = 10;
  if (deductions[0] === '1') {
    total -= 1;
  }
  if (deductions[1] === '1') {
    total -= 1;
  }
  if (deductions[2] === '1') {
    total -= 3;
  }
  if (deductions[3] === '1') {
    total -= 5;
  }
  if (deductions[4] === '1') {
    total -= 10;
  }
  if (deductions[5] === '+') {
    total += 0.5;
  } else if (deductions[5] === '-') {
    total -= 0.5;
  }
  return Math.min(Math.max(0, total), 10);
}

/**
 * 
 * @param {Array<number>} totals array of judge total up to 5
 * @returns {number} total after removing min max if needed
 */
export function calculateMoveTotal(totals) {
  let subTotal = 0;
  let min = 11;
  let max = -1;
  for (let ii = 0; ii < totals.length; ii++) {
    const value = totals[ii];
    subTotal += value;
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  if (totals.length > 3) {
    subTotal -= min;
  }
  if (totals.length > 4) {
    subTotal -= max;
  }
  return subTotal;
}

export function getScoreCounts(scores) {
  const totals = {
    s: 0,
    m: 0,
    b: 0,
  }
  scores.forEach((score) => {
    const deductions = score.deductions.split(':');
    if (deductions[0] === '1') {
      totals.s++;
    }
    if (deductions[1] === '1') {
      totals.s++;
    }
    if (deductions[2] === '1') {
      totals.m++;
    }
    if (deductions[3] === '1') {
      totals.b++;
    }
  });
  return totals;
}

export function objectToPairs(obj) {
  return Object.entries(obj).map(([key, value]) => {
    return { key, value };
  });
}
