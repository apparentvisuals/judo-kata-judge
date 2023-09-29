<template>
  <div v-if="!judge" class="bg bg-base-200 h-full flex">
    <div class="m-auto max-w-xs max-h-96">
      <form valid="isValid" @submit.prevent="submitJudge">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="code">
            <span class="label-text">Judge Code</span>
          </label>
          <input id="code" name="code" type="text" class="input input-bordered" v-model="code" />
        </div>
        <button type="submit" class="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  </div>
  <div v-if="judge" class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 rounded-box" :class="inputState">
      <div class="navbar-start">
        <button class="btn btn-square btn-sm btn-ghost" @click.prevent="changeJudge">
          <ArrowPathRoundedSquareIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="navbar-center">
        <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
        <div v-if="match">
          <div>{{ judge.name }}</div>
          <div>{{ `${match.tori}/${match.uke} (${getKataName(match.kata)})` }}</div>
        </div>
      </div>
      <div class="navbar-end">
        <button class="btn btn-sm btn-primary" @click.prevent.stop="submitScore">submit</button>
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
import { CheckIcon, PlusIcon, MinusIcon, ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/outline';
import { moveList, calculateMoveScore } from '~~/server/utils';
import { getKataName, handleServerError } from '~~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const matNumber = computed(() => route.params.mat);
const judgeNumber = computed(() => route.params.judge);

const error = useState('error', () => '');
const match = useState('match', () => undefined);
const judge = useState('judge', () => undefined);
const scores = useState('scores', () => []);
const code = useState('code', () => '');

const inputState = computed(() => {
  if (hasMajor.value) {
    return 'bg-warning';
  } else {
    return 'bg-success';
  }
});
const hasMajor = computed(() => scores.value.find((score) => score.deductions[4] === '1'));
const grandTotal = computed(() => scores.value.reduce((acc, value) => acc += value.total, 0));
const moves = computed(() => moveList(match.value.kata));

watch(hasMajor, () => {
  _computeScore();
});

async function submitScore() {
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

  _computeScore();
  await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, {
    method: 'POST',
    body: { move: score.number, deductions: score.deductions.join(':'), total: score.origTotal },
    headers: { authorization: `Bearer ${cookie.value.tCode}` }
  });
}

function _computeScore() {
  const values = scores.value;
  for (let ii = 0; ii < values.length; ii++) {
    const score = values[ii];
    let total = calculateMoveScore(score.deductions);
    if (hasMajor.value) {
      total = total / 2;
    }
    score.total = total;
  }
}

function _calculateScore(judgeInfo) {
  const count = moves.value.length;
  const newScores = new Array(count);
  for (let ii = 0; ii < count; ii++) {
    const score = judgeInfo.scores[ii];
    const deductions = score.deductions.split(':');
    const total = calculateMoveScore(deductions);
    newScores[ii] = { number: ii, deductions, total };
  }
  return newScores;
}

async function submitJudge() {
  try {
    error.value = '';
    judge.value = await $fetch(`/api/judges/${code.value}`, { headers: { authorization: `Bearer ${cookie.value.tCode}` } });
  } catch (err) {
    error.value = handleServerError(err);
  }
}

async function changeJudge() {
  judge.value = undefined;
  code.value = '';
}

async function _getMatch() {
  try {
    error.value = '';
    match.value = await $fetch(`/api/${matNumber.value}/match`, { headers: { authorization: `Bearer ${cookie.value.tCode}` } });
    const judgeValues = await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { headers: { authorization: `Bearer ${cookie.value.tCode}` } });
    const newScores = _calculateScore(judgeValues);
    scores.value = newScores;
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
