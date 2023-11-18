<template>
  <Error :error-string="error" />
  <div class="drawer min-h-full">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar bg-primary text-primary-content">
        <div class="navbar-start gap-4 hidden lg:flex">
          <img :src="getOrganizationImage(tournament.org)" class="h-12 hidden lg:block" />
          <div class="text-xl hidden md:block" v-if="judge">{{ judge.name }} ({{ judgeNumber }})</div>
        </div>
        <div class="navbar-center w-full md:w-auto">
          <label for="my-drawer" class="btn btn-primary btn-square drawer-button lg:hidden print:hidden">
            <Bars3Icon class="w-6 h-6" />
          </label>
          <span class="text-xl">{{ tournament.name }}</span>
        </div>
        <div class="navbar-end hidden md:flex">
          <button v-if="judgeCode" class="btn btn-sm btn-error print:hidden" @click.prevent="changeJudge">
            <ArrowPathIcon class="w-5 h-5" />
            Change Judge
          </button>
        </div>
      </div>
      <div v-if="status" class="min-h-full -mt-16 flex flex-col items-center justify-center">
        <div class="text-center">
          <span class="text-3xl font-bold">{{ status }}</span>
        </div>
        <div class="p-4">
          <span class="loading loading-ring loading-lg"></span>
        </div>
      </div>
      <div v-else-if="match && !judge" class="min-h-full -mt-16 flex flex-col items-center justify-center">
        <CodeForm v-model="judgeCode" title="Judge Code" @submit="submitCode" :error="codeError" />
      </div>
      <div v-else-if="match" class="w-full overflow-auto">
        <div class="navbar p-4 justify-between">
          <div class="text-xl hidden md:block">
            <span>{{ match.tori }}</span>
            /
            <span class="text-blue-500">{{ match.uke }}</span>
          </div>
          <div class="flex flex-col items-start">
            <div class="text-xl md:hidden">
              <span>{{ match.tori }}</span>
              /
              <span class="text-blue-500">{{ match.uke }}</span>
            </div>
            <div class="text-xl">{{ match ? getKataName(match.kata) : '' }}</div>
          </div>
          <button class="btn btn-sm btn-success print:hidden" @click.prevent="showSubmitScore"
            :disabled="!canSubmit">submit</button>
        </div>
        <ScoreTable :match="match" :scores="scores" />
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="p-4 w-80 min-h-full bg-base-200 text-base-content">
        <div class="flex gap-2 pb-4 items-center flex-col">
          <img :src="getOrganizationImage(tournament.org)" class="h-12" />
          <div class="text-lg text-center">{{ tournament.name }}</div>
        </div>
        <button v-if="judgeCode" class="btn btn-sm btn-error w-full" @click.prevent="changeJudge">
          <ArrowPathIcon class="w-5 h-5" />
          Change Judge
        </button>
      </div>
    </div>
  </div>
  <Prompt name="submit_score_modal" @submit="submitScore" text="Yes">
    <span>Submit final scores? (it can not be undone.)</span>
  </Prompt>
</template>

<script setup>
import { clone } from 'lodash-es';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { ArrowPathIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import { getKataName, getOrganizationImage, handleServerError, moveList } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const DEFAULT_SCORES = { id: '', points: [] };
const cookie = useCookie('jkj', { default: () => ({}) });

const route = useRoute();
const inviteCode = computed(() => route.params.invite);
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
const scores = useLocalStorage(`scores-${matNumber.value}-${judgeNumber.value}`, clone(DEFAULT_SCORES));

const headers = computed(() => ({ authorization: `Bearer ${tournament.value.id}` }));

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
const canSubmit = computed(() => {
  return scores.value.points.every((score) => score.value && score.value !== 10);
});

async function submitCode() {
  try {
    inAction.value = true;
    error.value = '';
    codeError.value = '';
    const judgeData = await $fetch(`/api/judges/${judgeCode.value}`, { headers: headers.value });
    judge.value = judgeData;
    if (judgeData.id !== scores.value.id) {
      scores.value = { id: judgeData.id, points: Array(moves.value.length).fill().map(() => ({ deductions: Array(6).fill().map('') })) };
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
  scores.value = clone(DEFAULT_SCORES);
}

function showSubmitScore() {
  submit_score_modal.showModal();
}

async function submitScore() {
  const body = _scoreToPayload();
  await $fetch(`/api/${matNumber.value}/${judgeNumber.value}`, { method: 'POST', body, headers: headers.value });
  submitted.value = true;
  scores.value = clone(DEFAULT_SCORES);
}

/**
 * @type UpdateEvents
 */
let event;
onMounted(async () => {
  tournament.value = await $fetch(`/api/invites/${inviteCode.value}`);
  event = new UpdateEvents(matNumber.value, tournament.value.id);
  event.connect((data) => {
    loading.value = false;
    if (data.error) {
      error.value = data.error;
      event.close();
      return;
    }
    if (data.index !== matchIndex || data.groupIndex !== groupIndex) {
      submitted.value = false;
      matchIndex.value = data.index;
      groupIndex.value = data.groupIndex;
      match.value = { ...data.match, completed: data.completed, judgeState: data.state };
      if (!scores.value.points || scores.value.points.length === 0 || !scores.value.points[0].deductions) {
        const newScores = { points: Array(moves.value.length).fill('').map(() => ({ deductions: Array(6).fill('') })) };
        if (judge.value) {
          newScores.id = judge.value.id;
        }
        scores.value = newScores;
      }
    }
  });
  if (judgeCode.value) {
    await submitCode();
  }
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
</script>
