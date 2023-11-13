
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

const NNK3_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Closing Ceremony'];
const NNK_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Tomoe-nage', 'Ura-nage', 'Sumi-gaeshi', 'Yoko-gake', 'Yoko-guruma', 'Uki-waza', 'Closing Ceremony'];
const KNK_MOVE_LIST = ['Opening Ceremony', 'Kesa-gatame', 'Kata-gatame', 'Kami-shiho-gatame', 'Yoko-shiho-gatame', 'Kuzure-kami-shiho-gatame', 'Kata-juji-jime', 'Hadaka-jime', 'Okuri-eri-jime', 'Kataha-jime', 'Gyaku-juji-jime', 'Ude-garami', 'Ude-hishigi-juji-gatame', 'Ude-hishigi-ude-gatame', 'Ude-hishigi-hiza-hatame', 'Ashi-garami', 'Closing Ceremony'];
const JNK_MOVE_LIST = ['Opening Ceremony', 'Tsuki-dashi', 'Kata-oshi', 'Ryote-dori', 'Kata-mawashi', 'Ago-oshi', 'Kiri-oroshi', 'Ryokata-oshi', 'Nanami-uchi', 'Katate-dori', 'Katate-age', 'Obi-tori', 'Mune-oshi', 'Tsuki-age', 'Uchi-oroshi', 'Ryogan-tsuki', 'Closing Ceremony'];
const KGJ_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Hidari-eri-dori', 'Migi-eri-dori', 'Kataude-dori', 'Ushiro-eri-dori', 'Ushiro-jime', 'Kakae-dori', 'Naname-uchi', 'Ago-tsuki', 'Ganmen-tsuki', 'Mae-geri', 'Yoko-geri', 'Tsukkake', 'Choku-tsuki', 'Naname-tsuki', 'Furi-age', 'Furi-oroshi', 'Morote-tsuki', 'Shomen-zuke', 'Koshi-gamae', 'Haimen-zuke', 'Closing Ceremony'];
const KINK_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Tsukkake', 'Suri-age', ' Yoko-uchi', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Yoko-tsuki', 'Ryote-dori', 'Sode-tori', 'Tsukkake', 'Tsuki-age', 'Suri-age', ' Yoko-uchi', 'Ke-age', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Nuki-gake', 'Kiri-oroshi', 'Closing Ceremony'];

// KODOMO NO KATA lists
// Optional Numeric prefixing used to Group List Items.
// A simple regex check can be done to rip out prefix before displaying item.
// GUI can detect changes between prefix to determine/indicate new group.
const KO1_MOVE_LIST = [
  '1-Opening Ceremony', 
  '2-Mae-mawari-ukemi Horse To Feet', 
  '3-Uchi-mata Fixed', 
  '3-Uchi-mata Dynamic', 
  '4-Harai-goshi Fixed', 
  '4-Harai-goshi Dynamic', 
  '5-Ko-uchi gari to Ippon-seoinage Transition', 
  '6-Ippon-seoinage to Kesa-gatame Transition', 
  '6-Ushiro-kesa-gatame Transition', 
  '6-Yoko-shiho-gatame Transition', 
  '6-Kami-shiho-gatame Transition', 
  '7-Closing Ceremony',
];
const KO2_MOVE_LIST =  [
  '1-Opening Ceremony', 
  '2-Mae-ukemi Stand', 
  '2-Mae-mawari-ukemi Walk To Feet', 
  '3-O-uchi-gari Fixed & Dynamic', 
  '4-Ko-uchi-gari Fixed & Dynamic', 
  '5-O-soto-gari Resistance',
  '5-O-soto-gari Direct',
  '6-O-uchi to Ko-uchi Combination', 
  '7-O-soto-gari to Yoko-shiho-gatame Transition', 
  '7-Tate-shiho-gatame Transition', 
  '7-Kata-gatame Transition', 
  '8-Closing Ceremony',
];
const KO3_MOVE_LIST = [
  '1-Opening Ceremony', 
  '2-Mae-ukemi Knees to Feet', 
  '2-Mae-mawari-ukemi Walk To Feet',  
  '3-Mae-mawari-sabaki & Ushiro-mawari-sabaki', 
  '4-Tai-sabaki Kuzushi', 
  '5-Sasae-tsurikomi-ashi Circular', 
  '6-Ippon-seionage Lift/Step-Over', 
  '7-Tsuri-komi-goshi Lift/Step-Over', 
  '8-Sasae-tsurikomi-ashi to Kesa Transition', 
  '9-Closing Ceremony',
];
const KO4_MOVE_LIST =  [
  '1-Opening Ceremony', 
  '2-Ushiro-ukemi Walking', 
  '2-Yoko-ukemi Sliding', 
  '2-Mae-mawari-ukemi Stand to Flat', 
  '3-Mae-sabaki & Ushiro-sabaki', 
  '3-Mae-mawari-sabaki & Ushiro-mawari-sabaki', 
  '4-Happo-no-kuzushi Moving',
  '5-Hiza-guruma Stand', 
  '6-Tai-otoshi Step-Over', 
  '7-O-goshi Lift/Step-Over', 
  '8-Closing Ceremony',
];
const KO5_MOVE_LIST = [
  '1-Opening Ceremony', 
  '2-Ushiro-ukemi Stand to Feet',
  '2-Yoko-ukemi Stand to Feet', 
  '2-Mae-mawari-ukemi Knees to Flat', 
  '3-Kumi-kata & Ugoki-kata', 
  '4-Happo-no-kuzushi Fixed', 
  '5-De-ashi-harai Stand', 
  '6-Uki-otoshi Side-Roll', 
  '7-Uki-goshi Step-Over', 
  '8-Closing Ceremony',
];
const KO6_MOVE_LIST = [
  '1-Opening Ceremony', 
  '2-Ushiro-ukemi Sit to Sit', 
  '2-Ushiro-ukemi Grip to Squat', 
  '2-Yoko-ukemi Squat', 
  '2-Mae-mawari-ukemi Horse to Flat', 
  '3-Mae-mawari-sabaki', 
  '3-Ushiro-mawari-sabaki', 
  '4-Ayumi-ashi', 
  '4-Tsugi-ashi Side & Circle', 
  '5-Hiza-guruma Knee', 
  '6-Tai-otoshi Knee', 
  '7-Closing Ceremony',
];
const KO7_MOVE_LIST = [
  '1-Opening Ceremony', 
  '2-Ushiro-ukemi Flat', 
  '2-Ushiro-ukemi Sit to Sit', 
  '2-Yoko-ukemi Side to Flat', 
  '2-Outen-ukemi Fours to Flat', 
  '3-Mae-sabaki', 
  '3-Ushiro-sabaki', 
  '4-Ayumi-ashi', 
  '4-Tsugi-ashi Side', 
  '5-Mae-sabaki Knees Throwing', 
  '6-Ushiro-sabaki Knee Throwing', 
  '7-Closing Ceremony',
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
