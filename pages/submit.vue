<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box m-2">
      <div class="navbar-start">
        <!-- <button class="btn btn-square btn-ghost" @click.prevent="navigateTo('/code?from=/schedule')">
          <ArrowLeftIcon class="w-6 h-6" />
        </button> -->
      </div>
      <div class="navbar-center">
        <div v-if="numberOfMats > 0">
          <div class="btn-group pr-2">
            <button class="btn" :class="matNumber === number ? 'btn-active' : ''" v-for="number in numberOfMats"
              @click.stop="matNumber = number">
              {{ `mat ${number}` }}
            </button>
          </div>
          <div class="btn-group">
            <button class="btn" :class="judge === number ? 'btn-active' : ''" v-for="number in 5"
              @click.stop="judge = number">
              {{ `judge ${number}` }}
            </button>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
      </div>
    </div>
    <table v-show="!error" class="table w-full p-4">
      <thead>
        <tr>
          <th>Technique</th>
          <th class="px-0 w-24 text-center">Small (1)</th>
          <th class="px-0 w-24 text-center">Small (1)</th>
          <th class="px-0 w-24 text-center">Medium (3)</th>
          <th class="px-0 w-24 text-center">Big (5)</th>
          <th class="px-0 w-24 text-center">Major (0)</th>
          <th class="px-0 w-24 text-center">Correction</th>
          <th class="px-0 w-24 text-center">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover" v-for="(score, index) in scores">
          <td>{{ moves[index] }}</td>
          <td v-for="(deduction, index) in score.deductions" class="p-0">
            <button class="block h-16 w-full pl-8" @click.prevent="toggleScore(score, index)">
              <CheckIcon class="w-8" v-if="deduction === '1'" />
              <PlusIcon class="w-8" v-if="index === 5 && deduction === '+'" />
              <MinusIcon class="w-8" v-if="index === 5 && deduction === '-'" />
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
import { moveList } from '~~/server/utils';
import { handleServerError } from '~~/src/utils';

const auth = useAuth();
const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });
const match = useState('match', () => { return {}; });
const judge = useState('judge', () => 1);
const scores = useState('scores', () => []);
const majorIndex = useState('majorIndex', () => []);
const matNumber = useState('matNumber', () => 0);

const hasMajor = computed(() => majorIndex.value.find((item) => item));
const grandTotal = computed(() => scores.value.reduce((acc, value) => acc += value.total, 0));
const numberOfMats = computed(() => tournament.value.numberOfMats || 0);
const moves = computed(() => moveList(match.value.kata));
const numberOfTechniques = computed(() => moves.value.length);

watch(hasMajor, () => {
  computeScore();
});

watch(matNumber, async () => {
  await _getMatch();
});

watch(judge, async () => {
  await _getMatch();
});

try {
  tournament.value = await $fetch(`/api/tournament/${auth.value}`);
  matNumber.value = 1;
} catch (err) {
  error.value = handleServerError(err);
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
    headers: { authorization: `Bearer ${auth.value}` }
  });
}

function computeScore() {
  const values = scores.value;
  for (let ii = 0; ii < values.length; ii++) {
    const score = values[ii];
    const deductions = score.deductions;
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
    score.origTotal = total;
    if (score.number > hasMajor.value - 1) {
      total /= 2;
    }
    if (deductions[5] === '+') {
      total += 0.5;
    } else if (deductions[5] === '-') {
      total -= 0.5;
    }
    score.total = Math.min(Math.max(0, total), 10);
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
    match.value = await $fetch(`/api/${matNumber.value}/match`, { headers: { authorization: `Bearer ${auth.value}` } });
    const judgeInfo = await $fetch(`/api/${matNumber.value}/${judge.value}`, { headers: { authorization: `Bearer ${auth.value}` } });
    const { newScores, newMajorIndex } = calculateScore(judgeInfo);
    scores.value = newScores;
    majorIndex.value = newMajorIndex;
  } catch (err) {
    error.value = handleServerError(err);
  }
}
</script>
