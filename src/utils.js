// This is just so we can compile the application.
// The goal is to get this to come from the JSON files, stored under /data/lists.
// However, one issue is that, the gitignore file doesn't allow commits for that folder (data/*) so the JSON files are stored under src/data for now.
const ko1 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const ko2 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const ko3 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const ko4 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const ko5 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const ko6 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const ko7 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const nnk3 = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const nnk = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const kgj = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const knk = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const kink = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};
const jnk = { moves: ["etiquette:Opening Ceremony", "etiquette:Closing Ceremony"]};

export const ORG_MAP = {
  'jc': 'Judo Canada',
  'ab': 'Judo Alberta',
  'bc': 'Judo BC',
  'sk': 'Judo Saskatchewan',
  'mb': 'Judo Manitoba',
  'on': 'Judo Ontario',
  'qc': 'Judo Quebec',
  'nb': 'Judo New Brunswick',
  'ns': 'Judo Nova Scotia',
  'pe': 'Judo PEI',
  'nl': 'Newfoundland and Labrador Judo Association',
  'yt': 'Judo Yukon',
  'nt': 'NWT Judo Association',
  'nu': 'Judo Nunavut',
};

export const ORG_IMAGE_MAP = {
  'ab': '/img/judo-alberta.png',
  'bc': '/img/judo-bc.png',
  'sk': '/img/judo-sask.png',
  'mb': '/img/judo-manitoba.png',
  'on': '/img/judo-ontario.png',
  'qc': '/img/judo-quebec.png',
  'nb': '/img/judo-nb.png',
  'ns': '/img/judo-ns.png',
  'pe': '/img/judo-pei.png',
  'nl': '/img/judo-newfoundland.png',
  'yt': '/img/judo-yukon.png',
  'nt': '/img/judo-nwt.png',
  'nu': '/img/judo-nunavut.png',
};

export const PROVINCE_MAP = {
  'ab': 'Alberta',
  'bc': 'British Columbia',
  'sk': 'Saskatchewan',
  'mb': 'Manitoba',
  'on': 'Ontario',
  'qc': 'Quebec',
  'nb': 'New Brunswick',
  'ns': 'Nova Scotia',
  'pe': 'Prince Edward Island',
  'nl': 'Newfoundland and Labrador',
  'yt': 'Yukon',
  'nt': 'Northwest Territories',
  'nu': 'Nunavut',
};

export const LEVEL_MAP = {
  'p': 'Provincial',
  'n': 'National',
  'pjc': 'PJC',
  'ijf': 'IJF',
}

export const RANK_MAP = {
  '6k': 'White',
  '6k+': 'White-Yellow',
  '5k': 'Yellow',
  '5k+': 'Yellow-Orange',
  '4k': 'Orange',
  '4k+': 'Orange-Green',
  '3k': 'Green',
  '3k+': 'Green-Blue',
  '2k': 'Blue',
  '2k+': 'Blue-Brown',
  '1k': 'Brown',
  '1d': 'Shodan (1st)',
  '2d': 'Nidan (2nd)',
  '3d': 'Sandan (3rd)',
  '4d': 'Yondan (4th)',
  '5d': 'Godan (5th)',
  '6d': 'Rokudan (6th)',
  '7d': 'Shichidan (7th)',
  '8d': 'Hachidan (8th)',
  '9d': 'Kudan (9th)',
}

export const KATA_MAP = {
  'nnk3': 'Nage-no-kata 3-Set',
  'nnk': 'Nage-no-kata',
  'knk': 'Katame-no-kata',
  'jnk': 'Ju-no-kata',
  'kgj': 'Kodokan-goshin-jutsu',
  'kink': 'Kime-no-kata',
  'ko1': 'Kodomo-no-kata 1',
  'ko2': 'Kodomo-no-kata 2',
  'ko3': 'Kodomo-no-kata 3',
  'ko4': 'Kodomo-no-kata 4',
  'ko5': 'Kodomo-no-kata 5',
  'ko6': 'Kodomo-no-kata 6',
  'ko7': 'Kodomo-no-kata 7',
}

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

export function moveList(kata) {
  switch (kata) {
    case 'nnk3':
      return nnk3.moves;
    case 'nnk':
      return nnk.moves;
    case 'knk':
      return knk.moves;
    case 'jnk':
      return jnk.moves;
    case 'kgj':
      return kgj.moves;
    case 'kink':
      return kink.moves;
    case 'ko1':
      return ko1.moves;
    case 'ko2':
      return ko2.moves;
    case 'ko3':
      return ko3.moves;
    case 'ko4':
      return ko4.moves;
    case 'ko5':
      return ko5.moves;
    case 'ko6':
      return ko6.moves;
    case 'ko7':
      return ko7.moves;
    default: return [];
  }
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
