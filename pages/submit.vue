<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="my-0 mx-auto w-full p-6">
      <div class="py-6">
        <label>mat: 1, judge:</label>
        <input type=" number" class="input" v-model.number="judge" />
      </div>
      <table class="table w-full">
        <thead>
          <tr>
            <th>Technique</th>
            <th class="px-0 w-24 text-center">Small (1)</th>
            <th class="px-0 w-24 text-center">Small (1)</th>
            <th class="px-0 w-24 text-center">Medium (3)</th>
            <th class="px-0 w-24 text-center">Big (5)</th>
            <th class="px-0 w-24 text-center">Forgotten (0)</th>
            <th class="px-0 w-24 text-center">Correction</th>
            <th class="px-0 w-24 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover" v-for="score in scores">
            <td>{{ score.technique }}</td>
            <td v-for="(deduction, index) in score.deductions" class="p-0">
              <button class="btn btn-lg btn-block block rounded-none bg-transparent border-none"
                @click.prevent="toggleScore(score, index)">
                <CheckIcon v-if="deduction === '1'" />
                <PlusIcon v-if="index === 5 && deduction === '+'" />
                <MinusIcon v-if="index === 5 && deduction === '-'" />
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
  </div>
</template>

<script setup>
import { CheckIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';

const judge = useState('judge', () => 1);
const scores = useState('scores', () => []);
const majorIndex = useState('majorIndex', () => []);
const hasMajor = computed(() => majorIndex.value.find((item) => item));
const grandTotal = computed(() => scores.value.reduce((acc, value) => acc += value.total, 0));
let moveList = [];
let numberOfTechniques = 0;

const mat = 1;
const match = await $fetch(`/api/${mat}/match`);
if (match) {
  moveList = match.moveList;
  numberOfTechniques = moveList.length;

  scores.value = calculateScore();
  majorIndex.value = new Array(numberOfTechniques).fill(0);
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
  await $fetch(`/api/${mat}/${judge.value}/submit-score`, { method: 'POST', body: { move: score.number, deductions: score.deductions.join(':'), total: score.origTotal } });
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

watch(hasMajor, (newValue, oldValue) => {
  computeScore();
});

watch(judge, () => {
  scores.value = calculateScore();
});

function calculateScore() {
  return new Array(numberOfTechniques).fill().map((score, index) => {
    return { number: index, technique: moveList[index], deductions: Array(6).fill(''), total: 10 };
  });
}
</script>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
}

.bg {
  background-image: radial-gradient(hsla(var(--bc)/.2) 0.5px, hsla(var(--b2)/1) 0.5px);
  background-size: 5px 5px;
}
</style>
