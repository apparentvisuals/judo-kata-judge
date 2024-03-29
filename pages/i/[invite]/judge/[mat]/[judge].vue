<template>
  <Error :error-string="error" />
  <div class="navbar fixed top-0 z-10 bg-base-100">
    <div class="navbar-start gap-2">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-square drawer-button print:hidden">
          <Bars3Icon class="w-6 h-6" />
        </label>
        <div tabindex="0"
          class="dropdown-content flex flex-col gap-2 items-center w-80 bg-secondary mt-3 p-2 z-50 shadow">
          <img class="h-12 md:hidden" :src="getOrganizationImage(tournament || {}.org)" />
          <div class="text-xl font-bold text-center xl:hidden">{{ title }}</div>
          <button v-if="judgeCode" class="btn btn-sm btn-error w-full" @click.prevent.stop="changeJudge">
            <ArrowPathIcon class="w-5 h-5" />
            Change Judge
          </button>
        </div>
      </div>
      <img class="h-12 hidden md:inline" :src="getOrganizationImage(tournament || {}.org)" />
      <div class="text-xl text-center font-bold hidden xl:block">{{ title }}</div>
    </div>
    <div class="navbar-center gap-2">
      <!-- <div class="text-xl font-bold" v-if="judge">{{ judge.name }} ({{ judgeNumber }})</div> -->
      <div class="text-xl font-bold" v-if="match && group">{{ match.tori }} / {{ match.uke }} ({{ getGroupName(group) }})</div>
    </div>
    <div class="navbar-end">
      <button v-if="match && judge" class="btn btn-sm btn-success print:hidden" @click.prevent="showSubmitScore"
        :disabled="!canSubmit">Submit</button>
    </div>
  </div>
  <div v-if="status" class="fixed top-16 bottom-0 w-full flex flex-col items-center justify-center">
    <div class="text-center">
      <span class="text-3xl font-bold">{{ status }}</span>
    </div>
    <div class="p-2">
      <span class="loading loading-ring loading-lg"></span>
    </div>
  </div>
  <div v-else-if="match && !judge" class="fixed top-16 bottom-0 w-full flex flex-col items-center justify-center">
    <CodeForm v-model="judgeCode" title="Judge Code" @submit="submitCode" :error="codeError" />
  </div>
  <div v-else-if="match" class="pt-16 pb-8">
    <div class="navbar p-2 justify-between">
      <div class="text-xl hidden md:block">
        {{ judge.name }} ({{ judgeNumber }})
      </div>
      <div class="flex flex-col items-start">
        <div class="text-xl md:hidden">
          <span>{{ match.tori }}</span>
          /
          <span class="text-blue-500">{{ match.uke }}</span>
        </div>
        <div class="text-xl">{{ match ? getGroupName(group) : '' }}</div>
      </div>
    </div>
    <ScoreTable :match="match" :group="group" :scores="scores" />
  </div>
  <Prompt name="submit_score_modal" @submit="submitScore" text="Yes">
    <span>Submit final scores? (it can not be undone.)</span>
  </Prompt>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});

import { clone } from 'lodash-es';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { ArrowPathIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import { getGroupName, getKataName, getOrganizationImage, handleServerError, moveList } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const cookie = useCookie('jkj', { default: () => ({}) });

const route = useRoute();
const inviteCode = computed(() => route.params.invite);
const matNumber = computed(() => route.params.mat);
const judgeNumber = computed(() => route.params.judge);

const DEFAULT_SCORES = { id: '', points: [] };

const error = ref('');
const tournament = ref(undefined);
const match = ref(undefined);
const group = ref(undefined);
const state = ref(undefined);
const codeError = ref('');
const loading = ref(true);
const judge = ref(undefined);
const inAction = ref(false);
const scores = useLocalStorage(`scores`, clone(DEFAULT_SCORES));

const moves = computed(() => group.value ? moveList(group.value.kata) : []);

const title = computed(() => {
  if (tournament.value) {
    return `${tournament.value.name} Mat ${parseInt(matNumber.value) + 1}`;
  }
});

const judgeCode = computed({
  get() {
    return cookie.value.jCode;
  },
  set(value) {
    cookie.value.jCode = value;
  }
});

const status = computed(() => {
  if (loading.value) {
    return 'Loading match info ...';
  }
  if (!tournament.value) {
    return error.value;
  }
  if (scores.value.matchIndex === -1) {
    return 'No more matches';
  }
  if (judgeNumber.value > group.value.numberOfJudges) {
    return 'Invalid Judge Position';
  }
  if (!match.value.completed && state.value[judgeNumber.value - 1]) {
    return 'Please wait until all judges have submitted their score...';
  }
  return '';
});

const canSubmit = computed(() => {
  return scores.value.points.every((score) => score.value != null && score.value !== 10);
});

async function submitCode() {
  try {
    inAction.value = true;
    error.value = '';
    codeError.value = '';
    judge.value = await $fetch(`/api/invites/${inviteCode.value}/${matNumber.value}/${judgeCode.value}`);
  } catch (err) {
    codeError.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function changeJudge() {
  judge.value = undefined;
  judgeCode.value = '';
  scores.value.points = Array(moves.value.length).fill('').map(() => ({ deductions: Array(6).fill('') }));
  if (event) {
    event.close();
  }
}

function showSubmitScore() {
  submit_score_modal.showModal();
}

async function submitScore() {
  try {
    inAction.value = true;
    error.value = '';
    const body = _scoreToPayload();
    const response = await $fetch(`/api/invites/${inviteCode.value}/${matNumber.value}/${judgeNumber.value}`, { method: 'POST', body });
    state.value = response;
    scores.value.points = [];
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

if (judgeCode.value) {
  await submitCode();
}

/**
 * @type UpdateEvents
 */
let event = new UpdateEvents(matNumber.value, inviteCode.value);
onMounted(async () => {
  if (scores.value.mat !== matNumber.value || scores.value.judge !== judgeNumber.value) {
    scores.value = clone(DEFAULT_SCORES);
    scores.value.mat = matNumber.value;
    scores.value.judge = judgeNumber.value;
  }

  event.connect((data) => {
    error.value = '';
    loading.value = false;
    if (data.error) {
      error.value = data.error;
      event.close();
      return;
    }

    if (data.tournament) {
      tournament.value = data.tournament;
    }
    group.value = data.group;
    match.value = data.match;
    state.value = data.state;

    if (data.matchIndex === -1) {
      // scores.value = clone(DEFAULT_SCORES);
    } else if (data.matchIndex !== scores.value.matchIndex || data.groupIndex !== scores.value.groupIndex) {
      // scores.value = clone(DEFAULT_SCORES);
      scores.value.points = Array(moves.value.length).fill('').map(() => ({ deductions: Array(6).fill('') }));
    }

    scores.value.matchIndex = data.matchIndex;
    scores.value.groupIndex = data.groupIndex;
  });
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});

function _scoreToPayload() {
  const payload = { id: match.value.id };
  const judgeData = { id: judge.value.id, name: judge.value.name, scores: [] };
  for (const score of scores.value.points) {
    judgeData.scores.push({ deductions: (score.deductions || Array(6).fill('')).join(':') });
  }
  payload.judge = judgeData;
  return payload;
}
</script>
