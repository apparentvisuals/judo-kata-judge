export const PROVINCE_MAP = {
  'on': 'Ontario',
  'qc': 'Quebec',
};

export const LEVEL_MAP = {
  'p': 'Provincial',
  'n': 'National',
  'pjc': 'PJC',
  'ijf': 'IJF',
}

export const RANK_MAP = {
  '2k': 'Nikyo',
  '1k': 'Ikkyu',
  '1d': 'Shodan',
  '2d': 'Nidan',
  '3d': 'Sandan',
  '4d': 'Yondan',
}

export const KATA_MAP = {
  'nnk3': 'Nage-no-kata 3-Set',
  'nnk': 'Nage-no-kata',
  'knk': 'Katame-no-kata',
  'jnk': 'Ju-no-kata',
  'kgj': 'Kodokan-goshin-jutsu',
  'kink': 'Kime-no-kata',
  'ko5': 'Kodomo-no-kata 5',
  'ko6': 'Kodomo-no-kata 6',
  'ko7': 'Kodomo-no-kata 7',
}

export function getGroupName(group, index) {
  if (group.name) {
    return group.name;
  }
  if (group.kata) {
    return getKataName(group.kata);
  }
  return `Group ${index + 1}`;
}

export function getKataName(kata) {
  return KATA_MAP[kata] || '';
};

export function getProvinceName(code) {
  return PROVINCE_MAP[code] || '';
}

export function getLevelName(code) {
  return LEVEL_MAP[code] || '';
}

export function getRankName(code) {
  return RANK_MAP[code] || '';
}

export function handleServerError(err) {
  if (err.response) {
    return err.response._data.message;
  } else {
    return err.message;
  }
}
