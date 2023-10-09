import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

export function isDev() {
  return process.env.NODE_ENV !== 'production';
}

export function getToken(event) {
  const authorization = getHeader(event, 'authorization');
  if (!authorization) {
    return;
  }
  const [_header, token] = authorization.split(' ');
  if (_header !== 'Bearer' || !token) {
    return;
  }
  return token;
}

export function getAuth() {
  return process.env.AUTH_KEY;
}

export function createNoMatchMessage() {
  return `data: ${JSON.stringify({ error: 'no more matches' })}\n\n`
}

export function createUpdateMessage(tournament, mat, scores, index) {
  const completed = scores.every((judgeScore) => judgeScore.name);
  const update = { tournament: tournament.name, mat, index, completed };
  return `data: ${JSON.stringify(update)}\n\n`;
}

export function createReportMessage(report) {
  return `data: ${JSON.stringify(report)}\n\n`;
}

export function createSummaryMessage(mat) {
  const groups = mat.groups;
  const groupsSummary = groups.map((group) => {
    const matches = group.matches;
    const summary = matches.map((match) => {
      const matchSummary = {
        number: match.number,
        kata: match.kata,
        tori: match.tori,
        uke: match.uke,
        scores: [],
      }
      if (match.completed) {
        matchSummary.scores = match.results.summary.values;
        matchSummary.total = match.results.summary.total;
      }
      return matchSummary;
    });
    return summary;
  });
  return `data: ${JSON.stringify(groupsSummary)}\n\n`;
}

export function notifyAllClients(clients, message) {
  for (const res of clients) {
    res.write(message);
  }
}

export function numberOfTechniques(kata) {
  return moveList(kata).length;
}

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

export function createReport(match) {
  const scores = match.scores;
  const kata = match.kata;
  const numberOfJudges = match.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const report = _defaultTechniqueScore(match);
  const summary = {
    total: 0,
    values: new Array(numberOfJudges),
  }
  for (let ii = 0; ii < numberOfJudges; ii++) {
    const judgeScores = scores[ii];
    let hasMajor = false;
    let total = 0;
    if (judgeScores.scores) {
      for (let jj = 0; jj < techniquesCount; jj++) {
        const deductions = judgeScores.scores[jj].deductions.split(':');
        let value = calculateMoveScore(deductions);
        report[jj].values[ii] = value;
        total += value;
        if (deductions[4] === '1') {
          hasMajor = true;
        }
      }
      if (hasMajor) {
        total = total / 2;
      }
      summary.values[ii] = total;
    }
  }

  let total = 0;
  report.forEach((technique) => {
    let min = 11;
    let max = -1;
    let subTotal = 0;
    for (let ii = 0; ii < numberOfJudges; ii++) {
      const value = technique.values[ii];
      subTotal += value;
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    if (match.numberOfJudges > 3) {
      subTotal -= min;
    }
    if (match.numberOfJudges > 4) {
      subTotal -= max;
    }
    technique.total = subTotal;
    total += subTotal;
  });
  summary.total = total;

  return { report, summary };
}

function _defaultTechniqueScore(match) {
  const kata = match.kata;
  const numberOfJudges = match.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const list = moveList(kata);
  const report = new Array(techniquesCount).fill().map((_el) => {
    return { values: new Array(numberOfJudges).fill().map(() => 10) };
  });
  return report;
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

const NNK3_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Closing Ceremony'];
const NNK_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Tomoe-nage', 'Ura-nage', 'Sumi-gaeshi', 'Yoko-gake', 'Yoko-guruma', 'Uki-waza', 'Closing Ceremony'];
const KNK_MOVE_LIST = ['Opening Ceremony', 'Kesa-gatame', 'Kata-gatame', 'Kami-shiho-gatame', 'Yoko-shiho-gatame', 'Kuzure-kami-shiho-gatame', 'Kata-juji-jime', 'Hadaka-jime', 'Okuri-eri-jime', 'Kataha-jime', 'Gyaku-juji-jime', 'Ude-garami', 'Ude-hishigi-juji-gatame', 'Ude-hishigi-ude-gatame', 'Ude-hishigi-hiza-hatame', 'Ashi-garami', 'Closing Ceremony'];
const JNK_MOVE_LIST = ['Opening Ceremony', 'Tsuki-dashi', 'Kata-oshi', 'Ryote-dori', 'Kata-mawashi', 'Ago-oshi', 'Kiri-oroshi', 'Ryokata-oshi', 'Nanami-uchi', 'Katate-dori', 'Katate-age', 'Obi-tori', 'Mune-oshi', 'Tsuki-age', 'Uchi-oroshi', 'Ryogan-tsuki', 'Closing Ceremony'];
const KGJ_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Hidari-eri-dori', 'Migi-eri-dori', 'Kataude-dori', 'Ushiro-eri-dori', 'Ushiro-jime', 'Kakae-dori', 'Naname-uchi', 'Ago-tsuki', 'Ganmen-tsuki', 'Mae-geri', 'Yoko-geri', 'Tsukkake', 'Choku-tsuki', 'Naname-tsuki', 'Furi-age', 'Furi-oroshi', 'Morote-tsuki', 'Shomen-zuke', 'Koshi-gamae', 'Haimen-zuke', 'Closing Ceremony'];
const KINK_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Tsukkake', 'Suri-age', ' Yoko-uchi', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Yoko-tsuki', 'Ryote-dori', 'Sode-tori', 'Tsukkake', 'Tsuki-age', 'Suri-age', ' Yoko-uchi', 'Ke-age', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Nuki-gake', 'Kiri-oroshi', 'Closing Ceremony'];
const KO5_MOVE_LIST = ['Opening Ceremony', 'Ushiro-ukemi', 'Yoko-ukemi', 'Mae-mawari-ukemi', 'Kumi-kata & Ugoki-kata', 'Happo-no-kuzushi', 'De-ashi-harai', 'Uki-otoshi', 'Uki-goshi', 'Closing Ceremony'];
const KO6_MOVE_LIST = ['Opening Ceremony', 'Ushiro-ukemi Sit x2', 'Ushiro-ukemi Grip x2', 'Yoko-ukemi 1/Side', 'Mae-mawari-ukemi', 'Mae-mawari-sabaki', 'Ushiro-mawari-sabaki', 'Ayumi-ashi', 'Tsugi-ashi Side', 'Tsugi-ashi Circle', 'Hiza-guruma', 'Tai-otoshi', 'Closing Ceremony'];
const KO7_MOVE_LIST = ['Opening Ceremony', 'Ushiro-ukemi Back x2', 'Ushiro-ukemi Sit x2', 'Yoko-ukemi 1/Side', 'Outen-ukemi 1/Side', 'Ma-sabaki', 'Ushiro-sabaki', 'Ayumi-ashi', 'Tsugi-ashi', 'Mae-sabaki Throwing', 'Ushiro-sabaki Throwing', 'Closing Ceremony'];
