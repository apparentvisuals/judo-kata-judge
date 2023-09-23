<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box">
      <div class="navbar-start">
        <NuxtLink to="/" class="btn btn-square btn-ghost">
          <ArrowLeftIcon class="w-6 h-6" />
        </NuxtLink>
      </div>
      <div class="navbar-center">
        {{ `${match.number} - ${match.tori}/${match.uke} (${getKataName(match.kata)})` }}
      </div>
      <div class="navbar-end">
        <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
        <button v-else class="btn btn-primary" @click.prevent.stop="loadNext">submit</button>
      </div>
    </div>
    <table v-show="!error" class="table w-full p-4 bg-base-100">
      <thead>
        <tr>
          <th>Technique</th>
          <th class="score">S(1)</th>
          <th class="score">S(1)</th>
          <th class="score">M(3)</th>
          <th class="score">B(5)</th>
          <th class="score">F(0)</th>
          <th class="score">C</th>
          <th class="w-16 text-center">Score</th>
        </tr>
      </thead>
      <tbody class="bg-base-100">
        <tr v-for="(score, index) in scores">
          <td>{{ moves[index] }}</td>
          <td v-for="(deduction, index) in score.deductions" class="p-0 pt-1">
            <button class="btn btn-ghost btn-square" @click.prevent="toggleScore(score, index)">
              <CheckIcon class="h-5 w-5" v-if="deduction === '1'" />
              <PlusIcon class="h-6 w-6" v-if="index === 5 && deduction === '+'" />
              <MinusIcon class="h-6 w-6" v-if="index === 5 && deduction === '-'" />
            </button>
          </td>
          <td class="text-center">{{ score.total }}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="text-center">{{ grandTotal }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { CheckIcon, PlusIcon, MinusIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { moveList, calculateMoveScore } from '~~/server/utils';
import { getKataName, handleServerError } from '~~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const error = useState('error', () => '');
const tournament = useState('tournament', () => ({}));
const match = useState('match', () => ({}));
const scores = useState('scores', () => []);
const majorIndex = useState('majorIndex', () => []);

const matNumber = computed(() => route.params.mat);
const judge = computed(() => route.params.judge);
const hasMajor = computed(() => majorIndex.value.find((item) => item));
const grandTotal = computed(() => {
  const total = scores.value.reduce((acc, value) => acc += value.total, 0);
  if (hasMajor.value) {
    return total / 2;
  }
  return total;
});
const numberOfMats = computed(() => tournament.value.numberOfMats || 0);
const moves = computed(() => moveList(match.value.kata));
const numberOfTechniques = computed(() => moves.value.length);

watch(hasMajor, () => {
  computeScore();
});

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
  matNumber.value = 1;
} catch (err) {
  error.value = handleServerError(err);
}

async function loadNext() {
  await _getMatch();
}

async function toggleScore(score, index) {
  const deductions = score.deductions;
  if (index === 5) {
    if (deductions[index] === '+') {
      deductions[index] = '-';
    } else if (deductions[index] === '-') {
      deductions[index] = '';
    } else {
      deductions[index] = '+';
    }
  } else {
    if (deductions[index] === '1') {
      deductions[index] = '';
    } else {
      deductions[index] = '1';
    }
  }

  if (index === 4) {
    if (deductions[index] === '1') {
      majorIndex.value[score.number] = score.number + 1;
    } else {
      majorIndex.value[score.number] = 0;
    }
  }

  computeScore();
  await $fetch(`/api/${matNumber.value}/${judge.value}`, {
    method: 'POST',
    body: { move: score.number, deductions: score.deductions.join(':'), total: score.origTotal },
    headers: { authorization: `Bearer ${cookie.value.tCode}` }
  });
}

function computeScore() {
  const values = scores.value;
  for (let ii = 0; ii < values.length; ii++) {
    const score = values[ii];
    score.total = calculateMoveScore(score.deductions);
  }
}

function calculateScore(judgeInfo) {
  const count = numberOfTechniques.value;
  const newMajorIndex = new Array(count);
  const newScores = new Array(count);
  for (let ii = 0; ii < count; ii++) {
    const score = judgeInfo.scores[ii];
    const deductions = score.deductions.split(':');
    const total = score.value;
    newScores[ii] = { number: ii, deductions, total };
    newMajorIndex[ii] = deductions[4] === '1';
  }
  return { newScores, newMajorIndex };
}

async function _getMatch() {
  try {
    error.value = '';
    match.value = await $fetch(`/api/${matNumber.value}/match`, { headers: { authorization: `Bearer ${cookie.value.tCode}` } });
    const judgeInfo = await $fetch(`/api/${matNumber.value}/${judge.value}`, { headers: { authorization: `Bearer ${cookie.value.tCode}` } });
    const { newScores, newMajorIndex } = calculateScore(judgeInfo);
    scores.value = newScores;
    majorIndex.value = newMajorIndex;
  } catch (err) {
    error.value = handleServerError(err);
  }
}

await _getMatch();

</script>

<style>
.score {
  @apply w-12 text-center p-0;
}
</style>
