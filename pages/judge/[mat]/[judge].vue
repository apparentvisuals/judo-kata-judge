<template>
  <div v-if="error">
    <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
  </div>
  <div v-else class="bg bg-base-200 h-full">
    <div v-if="!judge" class="h-full flex">
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
    <div v-else class="navbar bg-base-100 rounded-box" :class="inputState">
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
        <button class="btn btn-sm btn-primary" @click.prevent="submitScore">submit</button>
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
          <td v-for="(deduction, dIndex) in score.deductions || Array(6).fill(0)" class="score"
            @click.prevent="toggleScore(score, dIndex)">
            <div class="h-6 px-1">
              <CheckIcon class="h-6 w-6" v-if="deduction === '1'" />
              <PlusIcon class="h-6 w-6" v-if="dIndex === 5 && deduction === '+'" />
              <MinusIcon class="h-6 w-6" v-if="dIndex === 5 && deduction === '-'" />
            </div>
          </td>
          <td class="text-center">{{ score.value }}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="text-center">{{ total }}</td>
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
const code = useState('code', () => '');
const judge = useState('judge', () => undefined);
const scores = useState('scores', () => []);

const headers = { authorization: `Bearer ${cookie.value.tCode}` };

const inputState = computed(() => {
  if (hasMajor.value) {
    return 'bg-warning';
  } else {
    return 'bg-success';
  }
});
const hasMajor = computed(() => scores.value.find((score) => score.deductions && score.deductions[4] === '1'));
const total = computed(() => {
  const total = scores.value.reduce((acc, score) => {
    if (score.value != null) {
      return acc += score.value;
    } else {
      return acc += 10;
    }
  }, 0);
  if (hasMajor.value) {
    return total / 2;
  }
  return total;
});
const moves = computed(() => moveList(match.value.kata));

async function submitJudge() {
  try {
    error.value = '';
    judge.value = await $fetch(`/api/judges/${code.value}`, { headers });
  } catch (err) {
    error.value = handleServerError(err);
  }
}

async function changeJudge() {
  judge.value = undefined;
  code.value = '';
}

async function toggleScore(score, index) {
  const deductions = score.deductions = score.deductions || Array(6).fill('');
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
  const moveValue = calculateMoveScore(score.deductions);
  score.value = moveValue;
}

async function submitScore() {
  const body = _scoreToPayload();
  const judgeValues = await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { method: 'POST', body, headers });
  scores.value = _payloadToScore(judgeValues);
  _subscribe();
}

async function _getMatch() {
  try {
    error.value = '';
    match.value = await $fetch(`/api/${matNumber.value}/match`, { headers });
    if (judgeNumber.value > match.value.numberOfJudges) {
      error.value = 'Invalid Judge Position';
    } else {
      const judgeValue = await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { headers });
      const newScores = _payloadToScore(judgeValue);
      scores.value = newScores;
    }
  } catch (err) {
    error.value = handleServerError(err);
  }
}

function _payloadToScore(judgeValue) {
  const count = moves.value.length;
  const newScores = Array(count).fill().map(() => ({}));
  for (let ii = 0; ii < count; ii++) {
    const judgeScores = judgeValue.scores || [];
    if (ii < judgeScores.length) {
      const score = judgeValue.scores[ii];
      const deductions = score.deductions.split(':');
      const total = calculateMoveScore(deductions);
      newScores[ii] = { deductions, value: total };
    }
  }
  return newScores;
}

function _scoreToPayload() {
  const payload = { id: judge.value.id, name: judge.value.name, scores: [] };
  for (const score of scores.value) {
    payload.scores.push({ deductions: (score.deductions || Array(6).fill('')).join(':') });
  }
  return payload;
}

let events;
function _subscribe() {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${matNumber.value}/updates?token=${cookie.value.tCode}`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.error) {
      if (data.completed) {
        error.value = '';
        events.close();
        scores.value = [];
        _getMatch();
      } else {
        error.value = 'Please wait until all judges have submitted their score';
      }
    } else {
      error.value = data.error;
      events.close();
    }
  };
}

await _getMatch();

</script>

<style>
.score {
  @apply w-12 text-center p-2;
}
</style>
