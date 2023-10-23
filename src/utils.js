export const ORG_MAP = {
  'jc': 'Judo Canada',
  'jo': 'Judo Ontario',
  'jq': 'Judo Quebec',
  'jb': 'Judo BC',
  'js': 'Judo Saskatchewan',
  'jm': 'Judo Manitoba'
};

export const PROVINCE_MAP = {
  'ab': 'Alberta',
  'bc': 'British Columbia',
  'mb': 'Manitoba',
  'nb': 'New Brunswick',
  'ns': 'Nova Scotia',
  'nl': 'Newfoundland and Labrador',
  'nt': 'Northwest Territories',
  'nu': 'Nunavut',
  'on': 'Ontario',
  'pe': 'Prince Edward Island',
  'qc': 'Quebec',
  'sk': 'Saskatchewan',
  'yt': 'Yukon',
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
  'ko5': 'Kodomo-no-kata 5',
  'ko6': 'Kodomo-no-kata 6',
  'ko7': 'Kodomo-no-kata 7',
}

const NNK3_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Closing Ceremony'];
const NNK_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Tomoe-nage', 'Ura-nage', 'Sumi-gaeshi', 'Yoko-gake', 'Yoko-guruma', 'Uki-waza', 'Closing Ceremony'];
const KNK_MOVE_LIST = ['Opening Ceremony', 'Kesa-gatame', 'Kata-gatame', 'Kami-shiho-gatame', 'Yoko-shiho-gatame', 'Kuzure-kami-shiho-gatame', 'Kata-juji-jime', 'Hadaka-jime', 'Okuri-eri-jime', 'Kataha-jime', 'Gyaku-juji-jime', 'Ude-garami', 'Ude-hishigi-juji-gatame', 'Ude-hishigi-ude-gatame', 'Ude-hishigi-hiza-hatame', 'Ashi-garami', 'Closing Ceremony'];
const JNK_MOVE_LIST = ['Opening Ceremony', 'Tsuki-dashi', 'Kata-oshi', 'Ryote-dori', 'Kata-mawashi', 'Ago-oshi', 'Kiri-oroshi', 'Ryokata-oshi', 'Nanami-uchi', 'Katate-dori', 'Katate-age', 'Obi-tori', 'Mune-oshi', 'Tsuki-age', 'Uchi-oroshi', 'Ryogan-tsuki', 'Closing Ceremony'];
const KGJ_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Hidari-eri-dori', 'Migi-eri-dori', 'Kataude-dori', 'Ushiro-eri-dori', 'Ushiro-jime', 'Kakae-dori', 'Naname-uchi', 'Ago-tsuki', 'Ganmen-tsuki', 'Mae-geri', 'Yoko-geri', 'Tsukkake', 'Choku-tsuki', 'Naname-tsuki', 'Furi-age', 'Furi-oroshi', 'Morote-tsuki', 'Shomen-zuke', 'Koshi-gamae', 'Haimen-zuke', 'Closing Ceremony'];
const KINK_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Tsukkake', 'Suri-age', ' Yoko-uchi', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Yoko-tsuki', 'Ryote-dori', 'Sode-tori', 'Tsukkake', 'Tsuki-age', 'Suri-age', ' Yoko-uchi', 'Ke-age', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Nuki-gake', 'Kiri-oroshi', 'Closing Ceremony'];
const KO5_MOVE_LIST = ['Opening Ceremony', 'Ushiro-ukemi', 'Yoko-ukemi', 'Mae-mawari-ukemi', 'Kumi-kata & Ugoki-kata', 'Happo-no-kuzushi', 'De-ashi-harai', 'Uki-otoshi', 'Uki-goshi', 'Closing Ceremony'];
const KO6_MOVE_LIST = ['Opening Ceremony', 'Ushiro-ukemi Sit x2', 'Ushiro-ukemi Grip x2', 'Yoko-ukemi 1/Side', 'Mae-mawari-ukemi', 'Mae-mawari-sabaki', 'Ushiro-mawari-sabaki', 'Ayumi-ashi', 'Tsugi-ashi Side', 'Tsugi-ashi Circle', 'Hiza-guruma', 'Tai-otoshi', 'Closing Ceremony'];
const KO7_MOVE_LIST = ['Opening Ceremony', 'Ushiro-ukemi Back x2', 'Ushiro-ukemi Sit x2', 'Yoko-ukemi 1/Side', 'Outen-ukemi 1/Side', 'Ma-sabaki', 'Ushiro-sabaki', 'Ayumi-ashi', 'Tsugi-ashi', 'Mae-sabaki Throwing', 'Ushiro-sabaki Throwing', 'Closing Ceremony'];

export function getOrganization(org) {
  if (org) {
    return ORG_MAP[org] || '';
  }
  return '';
}

export function moveList(kata) {
  switch (kata) {
    case 'nnk3':
      return NNK3_MOVE_LIST;
    case 'nnk':
      return NNK_MOVE_LIST;
    case 'knk':
      return KNK_MOVE_LIST;
    case 'jnk':
      return JNK_MOVE_LIST;
    case 'kgj':
      return KGJ_MOVE_LIST;
    case 'kink':
      return KINK_MOVE_LIST;
    case 'ko5':
      return KO5_MOVE_LIST;
    case 'ko6':
      return KO6_MOVE_LIST;
    case 'ko7':
      return KO7_MOVE_LIST;
    default: return [];
  }
}

export function duration(kata) {
  switch (kata) {
    case 'nnk3':
      return 4;
    case 'nnk':
      return 7;
    case 'knk':
      return 10;
    case 'jnk':
      return 9;
    case 'kgj':
      return 8;
    case 'kink':
      return 11;
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
