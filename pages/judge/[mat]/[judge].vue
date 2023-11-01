<template>
  <div v-if="error" class="toast toast-top z-50">
    <div class="alert alert-error">
      <h1 class="text-xl font-bold uppercase">{{ error }}</h1>
    </div>
  </div>
  <div class="navbar bg-primary fixed text-primary-content">
    <div class="navbar-start gap-2">
      <img :src="getOrganizationImage(tournament.org)" class="h-12" />
      <div class="text-xl">{{ tournament.name }}</div>
    </div>
    <div class="navbar-center">
      <div class="text-xl" v-if="judge">{{ judge.name }} ({{ judgeNumber }})</div>
    </div>
    <div class="navbar-end print:hidden">
      <button v-if="judgeCode" class="btn btn-sm btn-error" @click.prevent="changeJudge">
        <ArrowPathIcon class="w-5 h-5" />
        Change Judge
      </button>
    </div>
  </div>
  <div class="h-full flex">
    <div v-if="status" class="m-auto max-h-96 text-center">
      <div>
        <span class="text-3xl font-bold">{{ status }}</span>
      </div>
      <div class="p-4">
        <span class="loading loading-ring loading-lg"></span>
      </div>
    </div>
    <CodeForm v-else-if="match && !judge" v-model="judgeCode" title="Judge Code" @submit="submitCode"
      :error="codeError" />
    <div v-else-if="match" class="w-full overflow-auto mt-16">
      <div class="navbar bg-primary text-primary-content">
        <div class="navbar-start">
          <div class="text-xl">{{ `${match.tori} / ${match.uke}` }}</div>
        </div>
        <div class="navbar-center">
          <div class="text-xl">{{ match ? getKataName(match.kata) : '' }}</div>
        </div>
        <div class="navbar-end print:hidden">
          <button class="btn btn-sm btn-success" @click.prevent="showSubmitScore">submit</button>
        </div>
      </div>
      <table class="table w-full bg-base-100">
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
          <tr v-for="(score, index) in scores.points" :class="techniqueColour(score)">
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
            <td colspan="7">Total</td>
            <td class="text-center">{{ total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Prompt name="submit_score_modal" @submit="submitScore" text="Yes">
    <span>Submit final scores? (it can not be undone.)</span>
  </Prompt>
</template>

<script setup>
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { CheckIcon, PlusIcon, MinusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { calculateMoveScore } from '~/server/utils';
import { getKataName, getOrganizationImage, handleServerError, moveList } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const matNumber = computed(() => route.params.mat);
const judgeNumber = computed(() => route.params.judge);

const error = ref('');
const judgeCode = computed({
  get() {
    return cookie.value.jCode;
  },
  set(value) {
    cookie.value.jCode = value;
  }
});
const codeError = ref('');
const loading = ref(true);
const tournament = ref({});
const matchIndex = ref(-1);
const groupIndex = ref(-1);
const match = ref(undefined);
const judge = ref(undefined);
const inAction = ref(false);
const submitted = ref(false);
const scores = useLocalStorage(`scores-${matNumber.value}-${judgeNumber.value}`, { id: '', points: [] });


const headers = { authorization: `Bearer ${cookie.value.tCode}` };

const status = computed(() => {
  if (loading.value) {
    return 'Loading...';
  }
  if (matchIndex.value === -1) {
    return 'No more matches';
  }
  if (judgeNumber.value > match.value.numberOfJudges) {
    return 'Invalid Judge Position';
  }
  if (!match.value.completed && match.value.judgeState[judgeNumber.value - 1]) {
    return 'Please wait until all judges have submitted their score...';
  }
  if (submitted.value) {
    return 'Scores have been submitted. This page should auto refresh but if not please manually refresh';
  }
  return '';
});
const moves = computed(() => moveList(match.value.kata));
const hasMajor = computed(() => scores.value.points.find((score) => score.deductions && score.deductions[4] === '1'));
const total = computed(() => {
  const total = scores.value.points.reduce((acc, score) => {
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

async function submitCode() {
  try {
    inAction.value = true;
    _setError('');
    const judgeData = await $fetch(`/api/judges/${judgeCode.value}`, { headers });
    judge.value = judgeData;
    if (judgeData.id !== scores.value.id) {
      scores.value = { id: judgeData.id, points: Array(moves.value.length).fill().map(() => ({})) };
    }
  } catch (err) {
    codeError.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function changeJudge() {
  judge.value = undefined;
  judgeCode.value = '';
  scores.value = { points: [] };
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

function showSubmitScore() {
  submit_score_modal.showModal();
}

async function submitScore() {
  const body = _scoreToPayload();
  await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { method: 'POST', body, headers });
  submitted.value = true;
}

function techniqueColour(score) {
  if (score) {
    if (!score.deductions) {
      return 'bg-yellow-50';
    }
    if (score.deductions && score.deductions[4] === '1') {
      return 'bg-warning';
    }
    if (score.value === 10) {
      return 'bg-yellow-50';
    }
    return '';
  }

}

/**
 * @type UpdateEvents
 */
let event;
onMounted(async () => {
  event = new UpdateEvents(matNumber.value, cookie.value.tCode);
  event.connect((data) => {
    loading.value = false;
    if (data.error) {
      _setError(data.error);
      event.close();
      return;
    }
    tournament.value.name = data.tournament;
    tournament.value.org = data.org;
    if (data.index !== matchIndex || data.groupIndex !== groupIndex) {
      matchIndex.value = data.index;
      groupIndex.value = data.groupIndex;
      match.value = { ...data.match, completed: data.completed, judgeState: data.state };
      const newScores = { points: Array(moves.value.length).fill().map(() => ({})) };
      if (judge.value) {
        newScores.id = judge.value.id;
      }
      scores.value = newScores;
    }
  });
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});

function _scoreToPayload() {
  const payload = { id: judge.value.id, name: judge.value.name, scores: [] };
  for (const score of scores.value.points) {
    payload.scores.push({ deductions: (score.deductions || Array(6).fill('')).join(':') });
  }
  return payload;
}

let timeoutId;
function _setError(errorString) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  error.value = errorString;
  timeoutId = setTimeout(() => {
    error.value = '';
  }, 3000);
}

</script>

<style scoped>
.score {
  @apply w-14 text-center p-2.5;
}

td {
  @apply border;
}

@media print {
  table {
    @apply border;
  }
}
</style>
