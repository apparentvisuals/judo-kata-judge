<template>
  <div class="navbar bg-primary fixed text-primary-content">
    <div class="navbar-start gap-2">
      <img :src="getOrganizationImage(org)" class="h-12" />
      <div class="text-xl">{{ tournament }}</div>
    </div>
    <div class="navbar-center">
      <div class="text-xl" v-if="judge">{{ judge.name }}</div>
    </div>
    <div class="navbar-end print:hidden">
      <button v-if="code" class="btn btn-sm btn-error" @click.prevent="changeJudge">
        <ArrowPathIcon class="w-5 h-5" />
        Change Judge
      </button>
    </div>
  </div>
  <div class="h-full flex">
    <div v-if="wait" class="m-auto max-h-96 text-center">
      <div>
        <span class="text-3xl font-bold">{{ wait }}</span>
      </div>
      <div class="p-4">
        <span class="loading loading-ring loading-lg"></span>
      </div>
    </div>
    <div v-else-if="match && !judge" class="m-auto w-full p-1 xs:w-80 xs:p-0 max-h-96">
      <form valid="isValid" @submit.prevent="submitCode">
        <div class="form-control w-full">
          <label class="label" for="code">
            <span class="label-text">Judge Code</span>
          </label>
          <input id="code" name="code" type="text" class="input input-bordered" v-model="code" />
          <label class="label">
            <span for="code" class="label-text-alt text-error" v-if="error">{{ error }}</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
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
          <tr v-for="(score, index) in scores" :class="techniqueColour(score)">
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
import { CheckIcon, PlusIcon, MinusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { calculateMoveScore } from '~/server/utils';
import { getKataName, getOrganizationImage, handleServerError, moveList } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const matNumber = computed(() => route.params.mat);
const judgeNumber = computed(() => route.params.judge);

const error = useState('error', () => '');
const code = useState('code', () => '');
const tournament = ref('');
const org = ref('');
const match = useState('match', () => undefined);
const judge = useState('judge', () => undefined);
const scores = useState('scores', () => []);
const inAction = useState('in-action', () => false);
const wait = useState('wait', () => '');

const headers = { authorization: `Bearer ${cookie.value.tCode}` };

const moves = computed(() => moveList(match.value.kata));
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

async function submitCode() {
  try {
    inAction.value = true;
    error.value = '';
    judge.value = await $fetch(`/api/judges/${code.value}`, { headers });
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
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

function showSubmitScore() {
  submit_score_modal.showModal();
}

async function submitScore() {
  const body = _scoreToPayload();
  const judgeValues = await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { method: 'POST', body, headers });
  // scores.value = _payloadToScore(judgeValues);
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
let matchIndex = -1;
onMounted(async () => {
  event = new UpdateEvents(matNumber.value, cookie.value.tCode);
  event.connect((data) => {
    if (data.error) {
      wait.value = data.error;
      event.close();
      return;
    }
    wait.value = '';
    tournament.value = data.tournament;
    org.value = data.org;
    if (data.index === -1) {
      wait.value = 'no more matches';
    } else {
      if (data.index !== matchIndex) {
        matchIndex = data.index;
        match.value = data.match;
      }
      if (!data.completed && data.state[judgeNumber.value - 1]) {
        wait.value = 'Please wait until all judges have submitted their score...';
      }
    }
  });
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});

watch(match, async () => {
  if (match) {
    if (judgeNumber.value > match.value.numberOfJudges) {
      wait.value = 'Invalid Judge Position';
    } else {
      const judgeValue = await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { headers });
      const newScores = _payloadToScore(judgeValue);
      scores.value = newScores;
    }
  }
});

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
