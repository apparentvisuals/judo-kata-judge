export function createUpdateMessage(judge) {
  return `data: ${judge.number};${judge.name};${JSON.stringify(judge.scores)}\n\n`;
}

export function createReportMessage(report) {
  return `data: ${JSON.stringify(report)}\n\n`;
}

export function createSummaryMessage(matInfo) {
  const matches = matInfo.matches;
  const summary = matches.map((match) => {
    const matchSummary = {
      number: match.number,
      kata: match.kata,
      tori: match.tori,
      uke: match.uke,
    }
    if (match.completed) {
      matchSummary.scores = match.results.summary.values;
      matchSummary.total = match.results.summary.total;
    }
    return matchSummary;
  })
  return `data: ${JSON.stringify(summary)}\n\n`;
}

export function notifyAllClients(clients, message) {
  for (const res of clients) {
    res.write(message);
  }
}

export function numberOfTechniques(kata) {
  return moveList(kata).length;
}

export function createReport(match) {
  const judges = match.judges;
  const techniquesCount = numberOfTechniques(match.kata);
  const numberOfJudges = match.numberOfJudges;
  const judgesCount = judges.length;
  const report = _defaultTechniqueScore(match);
  const summary = {
    total: 0,
    values: new Array(judgesCount).fill(0),
  }
  for (const judge of judges) {
    const judgeIndex = judge.number;
    let hasMajor = false;
    let judgeTotal = 0;
    for (let ii = 0; ii < techniquesCount; ii++) {
      let moveTotal = judge.scores[ii].value;
      const [_small1, _small2, _medium, _big, forgotten, correction] = judge.scores[ii].deductions.split(':');
      if (hasMajor) {
        moveTotal /= 2;
      }
      if (correction === '+') {
        moveTotal += 0.5;
      } else if (correction === '-') {
        moveTotal -= 0.5;
      }
      report[ii].values[judgeIndex] = Math.min(Math.max(0, moveTotal), 10);;
      judgeTotal += moveTotal;

      if (forgotten === '1') {
        hasMajor = true;
      }
    }
    summary.values[judgeIndex] = judgeTotal;
  }

  let total = 0;
  report.forEach((technique) => {
    let min = 11;
    let max = -1;
    let subTotal = 0;
    for (let ii = 0; ii < judgesCount; ii++) {
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

  return { numberOfJudges, report, summary };
}

function _defaultTechniqueScore(match) {
  const kata = match.kata;
  const numberOfJudges = match.numberOfJudges;
  const techniquesCount = numberOfTechniques(kata);
  const list = moveList(kata);
  const report = new Array(techniquesCount).fill().map((el, index) => {
    return { technique: list[index], values: new Array(numberOfJudges).fill().map(() => 10) };
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
  }
}

const NNK3_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Closing Ceremony'];
const NNK_MOVE_LIST = ['Opening Ceremony', 'Uki-otoshi', 'Seoi-nage', 'Kata-guruma', 'Uki-goshi', 'Harai-goshi', 'Tsurikomi-goshi', 'Okuri-ashi-harai', 'Sasae-tsurikomi-ashi', 'Uchi-mata', 'Tomoe-nage', 'Ura-nage', 'Sumi-gaeshi', 'Yoko-gake', 'Yoko-guruma', 'Uki-waza', 'Closing Ceremony'];
const KNK_MOVE_LIST = ['Opening Ceremony', 'Kesa-gatame', 'Kata-gatame', 'Kami-shiho-gatame', 'Yoko-shiho-gatame', 'Kuzure-kami-shiho-gatame', 'Kata-juji-jime', 'Hadaka-jime', 'Okuri-eri-jime', 'Kataha-jime', 'Gyaku-juji-jime', 'Ude-garami', 'Ude-hishigi-juji-gatame', 'Ude-hishigi-ude-gatame', 'Ude-hishigi-hiza-hatame', 'Ashi-garami', 'Closing Ceremony'];
const JNK_MOVE_LIST = ['Opening Ceremony', 'Tsuki-dashi', 'Kata-oshi', 'Ryote-dori', 'Kata-mawashi', 'Ago-oshi', 'Kiri-oroshi', 'Ryokata-oshi', 'Nanami-uchi', 'Katate-dori', 'Katate-age', 'Obi-tori', 'Mune-oshi', 'Tsuki-age', 'Uchi-oroshi', 'Ryogan-tsuki', 'Closing Ceremony'];
const KGJ_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Hidari-eri-dori', 'Migi-eri-dori', 'Kataude-dori', 'Ushiro-eri-dori', 'Ushiro-jime', 'Kakae-dori', 'Naname-uchi', 'Ago-tsuki', 'Ganmen-tsuki', 'Mae-geri', 'Yoko-geri', 'Tsukkake', 'Choku-tsuki', 'Naname-tsuki', 'Furi-age', 'Furi-oroshi', 'Morote-tsuki', 'Shomen-zuke', 'Koshi-gamae', 'Haimen-zuke', 'Closing Ceremony'];
const KINK_MOVE_LIST = ['Opening Ceremony', 'Ryote-dori', 'Tsukkake', 'Suri-age', ' Yoko-uchi', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Yoko-tsuki', 'Ryote-dori', 'Sode-tori', 'Tsukkake', 'Tsuki-age', 'Suri-age', ' Yoko-uchi', 'Ke-age', 'Ushiro-dori', 'Tsukkomi', 'Kiri-komi', 'Nuki-gake', 'Kiri-oroshi', 'Closing Ceremony'];
