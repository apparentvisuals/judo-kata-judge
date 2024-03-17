const comp1 = require('./comp1.json');
const comp2 = require('./comp2.json');

console.log(comp1.uke + '/' + comp1.tori);
let bg = 0;
let md = 0;
let sm = 0;
let totals = getScoreCounts(comp1['1'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp1['2'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp1['3'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp1['4'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp1['5'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
console.log(`B/G: ${bg}, M/M: ${md}, S/M ${sm}`);
console.log(comp2.uke + '/' + comp2.tori);
bg = 0;
md = 0;
sm = 0;
totals = getScoreCounts(comp2['1'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp2['2'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp2['3'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp2['4'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
totals = getScoreCounts(comp2['5'].scores);
bg += totals.bg;
md += totals.md;
sm += totals.sm;
console.log(`B/G: ${bg}, M/M: ${md}, S/M ${sm}`);

function getScoreCounts(scores) {
  const totals = {
    sm: 0,
    md: 0,
    bg: 0,
  }
  scores.forEach((score) => {
    const deductions = score.deductions.split(':');
    if (deductions[0] === '1') {
      totals.sm++;
    }
    if (deductions[1] === '1') {
      totals.sm++;
    }
    if (deductions[2] === '1') {
      totals.md++;
    }
    if (deductions[3] === '1') {
      totals.bg++;
    }
  });
  return totals;
}
