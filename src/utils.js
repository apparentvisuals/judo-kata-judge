
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

const NNK3_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'te-waza:Uki-otoshi',
  'te-waza:Seoi-nage',
  'te-waza:Kata-guruma',
  'koshi-waza:Uki-goshi',
  'koshi-waza:Harai-goshi',
  'koshi-waza:Tsurikomi-goshi',
  'ashi-waza:Okuri-ashi-harai',
  'ashi-waza:Sasae-tsurikomi-ashi',
  'ashi-waza:Uchi-mata',
  'ceremony:Closing Ceremony'
];

const NNK_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'te-waza:Uki-otoshi',
  'te-waza:Seoi-nage',
  'te-waza:Kata-guruma',
  'koshi-waza:Uki-goshi',
  'koshi-waza:Harai-goshi',
  'koshi-waza:Tsurikomi-goshi',
  'ashi-waza:Okuri-ashi-harai',
  'ashi-waza:Sasae-tsurikomi-ashi',
  'ashi-waza:Uchi-mata',
  'ma-sutemi-waza:Tomoe-nage',
  'ma-sutemi-waza:Ura-nage',
  'ma-sutemi-waza:Sumi-gaeshi',
  'yoko-sutemi-waza:Yoko-gake',
  'yoko-sutemi-waza:Yoko-guruma',
  'yoko-sutemi-waza:Uki-waza',
  'ceremony:Closing Ceremony'
];

const KNK_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'osaekomi-waza:Kesa-gatame',
  'osaekomi-waza:Kata-gatame',
  'osaekomi-waza:Kami-shiho-gatame',
  'osaekomi-waza:Yoko-shiho-gatame',
  'osaekomi-waza:Kuzure-kami-shiho-gatame',
  'shime-waza:Kata-juji-jime',
  'shime-waza:Hadaka-jime',
  'shime-waza:Okuri-eri-jime',
  'shime-waza:Kataha-jime',
  'shime-waza:Gyaku-juji-jime',
  'kansetsu-waza:Ude-garami',
  'kansetsu-waza:Ude-hishigi-juji-gatame',
  'kansetsu-waza:Ude-hishigi-ude-gatame',
  'kansetsu-waza:Ude-hishigi-hiza-hatame',
  'kansetsu-waza:Ashi-garami',
  'ceremony:Closing Ceremony'
];

const JNK_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ikkyo:Tsuki-dashi',
  'ikkyo:Kata-oshi',
  'ikkyo:Ryote-dori',
  'ikkyo:Kata-mawashi',
  'ikkyo:Ago-oshi',
  'nikyo:Kiri-oroshi',
  'nikyo:Ryokata-oshi',
  'nikyo:Nanami-uchi',
  'nikyo:Katate-dori',
  'nikyo:Katate-age',
  'sankyo:Obi-tori',
  'sankyo:Mune-oshi',
  'sankyo:Tsuki-age',
  'sankyo:Uchi-oroshi',
  'sankyo:Ryogan-tsuki',
  'ceremony:Closing Ceremony'
];

const KGJ_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'unarmed-held:Ryote-dori',
  'unarmed-held:Hidari-eri-dori',
  'unarmed-held:Migi-eri-dori',
  'unarmed-held:Kataude-dori',
  'unarmed-held:Ushiro-eri-dori',
  'unarmed-held:Ushiro-jime',
  'unarmed-held:Kakae-dori',
  'unarmed-distance:Naname-uchi',
  'unarmed-distance:Ago-tsuki',
  'unarmed-distance:Ganmen-tsuki',
  'unarmed-distance:Mae-geri',
  'unarmed-distance:Yoko-geri',
  'armed-dagger:Tsukkake',
  'armed-dagger:Choku-tsuki',
  'armed-dagger:Naname-tsuki',
  'armed-stick:Furi-age',
  'armed-stick:Furi-oroshi',
  'armed-stick:Morote-tsuki',
  'armed-pistol:Shomen-zuke',
  'armed-pistol:Koshi-gamae',
  'armed-pistol:Haimen-zuke',
  'ceremony:Closing Ceremony'
];

const KINK_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'idori-waza-unarmed:Ryote-dori',
  'idori-waza-unarmed:Tsukkake',
  'idori-waza-unarmed:Suri-age',
  'idori-waza-unarmed:Yoko-uchi',
  'idori-waza-unarmed:Ushiro-dori',
  'idori-waza-armed:Tsukkomi',
  'idori-waza-armed:Kiri-komi',
  'idori-waza-armed:Yoko-tsuki',
  'tachi-waza-unarmed:Ryote-dori',
  'tachi-waza-unarmed:Sode-tori',
  'tachi-waza-unarmed:Tsukkake',
  'tachi-waza-unarmed:Tsuki-age',
  'tachi-waza-unarmed:Suri-age',
  'tachi-waza-unarmed:Yoko-uchi',
  'tachi-waza-unarmed:Ke-age',
  'tachi-waza-unarmed:Ushiro-dori',
  'tachi-waza-armed:Tsukkomi',
  'tachi-waza-armed:Kiri-komi',
  'tachi-waza-armed:Nuki-gake',
  'tachi-waza-armed:Kiri-oroshi',
  'ceremony:Closing Ceremony'
];

const KO1_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Mae-mawari-ukemi Horse To Feet',
  'ashi-waza:Uchi-mata Fixed',
  'ashi-waza:Uchi-mata Dynamic',
  'koshi-waza:Harai-goshi Fixed',
  'koshi-waza:Harai-goshi Dynamic',
  'te-waza:Ko-uchi gari to Ippon-seoinage Transition',
  'osaekomi-waza:Ippon-seoinage to Kesa-gatame Transition',
  'osaekomi-waza:Ushiro-kesa-gatame Transition',
  'osaekomi-waza:Yoko-shiho-gatame Transition',
  'osaekomi-waza:Kami-shiho-gatame Transition',
  'ceremony:Closing Ceremony',
];
const KO2_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Mae-ukemi Stand',
  'ukemi:Mae-mawari-ukemi Walk To Feet',
  'ashi-waza:O-uchi-gari Fixed & Dynamic',
  'ashi-waza:Ko-uchi-gari Fixed & Dynamic',
  'ashi-waza:O-soto-gari Resistance',
  'ashi-waza:O-soto-gari Direct',
  'ashi-waza:O-uchi to Ko-uchi Combination',
  'osaekomi-waza:O-soto-gari to Yoko-shiho-gatame Transition',
  'osaekomi-waza:Tate-shiho-gatame Transition',
  'osaekomi-waza:Kata-gatame Transition',
  'ceremony:Closing Ceremony',
];
const KO3_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Mae-ukemi Knees to Feet',
  'ukemi:Mae-mawari-ukemi Walk To Feet',
  'tai-sabaki:Mae-mawari-sabaki & Ushiro-mawari-sabaki',
  'tai-sabaki:Tai-sabaki Kuzushi',
  'ashi-waza:Sasae-tsurikomi-ashi Circular',
  'te-waza:Ippon-seionage Lift/Step-Over',
  'koshi-waza:Tsuri-komi-goshi Lift/Step-Over',
  'osaekomi-waza:Sasae-tsurikomi-ashi to Kesa Transition',
  'ceremony:Closing Ceremony',
];
const KO4_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Ushiro-ukemi Walking',
  'ukemi:Yoko-ukemi Sliding',
  'ukemi:Mae-mawari-ukemi Stand to Flat',
  'tai-sabaki:Mae-sabaki & Ushiro-sabaki',
  'tai-sabaki:Mae-mawari-sabaki & Ushiro-mawari-sabaki',
  'kuzushi:Happo-no-kuzushi Moving',
  'ashi-waza:Hiza-guruma Stand',
  'te-waza:Tai-otoshi Step-Over',
  'koshi-waza:O-goshi Lift/Step-Over',
  'ceremony:Closing Ceremony',
];
const KO5_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Ushiro-ukemi Stand to Feet',
  'ukemi:Yoko-ukemi Stand to Feet',
  'ukemi:Mae-mawari-ukemi Knees to Flat',
  'tai-sabaki:Kumi-kata & Ugoki-kata',
  'tai-sabaki:Happo-no-kuzushi Fixed',
  'ashi-waza:De-ashi-harai Stand',
  'te-waza:Uki-otoshi Side-Roll',
  'koshi-waza:Uki-goshi Step-Over',
  'ceremony:Closing Ceremony',
];
const KO6_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Ushiro-ukemi Sit to Sit',
  'ukemi:Ushiro-ukemi Grip to Squat',
  'ukemi:Yoko-ukemi Squat',
  'ukemi:Mae-mawari-ukemi Horse to Flat',
  'tai-sabaki:Mae-mawari-sabaki',
  'tai-sabaki:Ushiro-mawari-sabaki',
  'shintai-dosa:Ayumi-ashi',
  'shintai-dosa:Tsugi-ashi Side & Circle',
  'ashi-waza:Hiza-guruma Knee',
  'te-waza:Tai-otoshi Knee',
  'ceremony:Closing Ceremony',
];
const KO7_MOVE_LIST = [
  'ceremony:Opening Ceremony',
  'ukemi:Ushiro-ukemi Flat',
  'ukemi:Ushiro-ukemi Sit to Sit',
  'ukemi:Yoko-ukemi Side to Flat',
  'ukemi:Outen-ukemi Fours to Flat',
  'tai-sabaki:Mae-sabaki',
  'tai-sabaki:Ushiro-sabaki',
  'shintai-dosa:Ayumi-ashi',
  'shintai-dosa:Tsugi-ashi Side',
  'te-waza:Mae-sabaki Knees Throwing',
  'te-waza:Ushiro-sabaki Knee Throwing',
  'ceremony:Closing Ceremony',
];

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
  switch (kata) {
    case 'nnk3':
      return NNK3_MOVE_LIST.map((move) => move);
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
    case 'ko1':
      return KO1_MOVE_LIST;
    case 'ko2':
      return KO2_MOVE_LIST;
    case 'ko3':
      return KO3_MOVE_LIST;
    case 'ko4':
      return KO4_MOVE_LIST;
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
