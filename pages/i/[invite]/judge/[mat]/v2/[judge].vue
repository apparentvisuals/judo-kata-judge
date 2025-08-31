<template>
  <div v-if="status"
    class="w-full h-full flex flex-col items-center justify-center text-surface-800 dark:text-surface-200">
    <div class="text-3xl font-bold">{{ status }}</div>
    <div class="mt-4 p-4"><i class="pi pi-spinner animate-spin text-3xl" /></div>
  </div>
  <div v-else-if="!judge" class="fixed top-16 bottom-0 w-full flex flex-col items-center justify-center">
    <CodeForm v-model="judgeInput" title="Judge Code" @submit="submitCode" :error="codeError" />
  </div>
  <PublicContainer v-else-if="match">
    <div class="grow" style="height: 300px">
      <ScoreTable :match="match" :group="group" :scores="scores">
        <template #header>
          <div class="flex w-full justify-between" style="font-size: clamp(1rem, 2vw, 4rem);">
            <div class="hidden md:block">
              {{ match.tori }} / {{ match.uke }}
            </div>
            <div class="flex flex-col items-start">
              <div class="md:hidden">
                {{ match.tori }} / {{ match.uke }}
              </div>
              <div>{{ match ? getGroupName(group) : '' }}</div>
            </div>
            <div class="font-bold" v-if="match && group">
              {{ judge.name }} (Shadow)
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between w-full">
            <div class="flex gap-2">
              <PrimeButton v-if="judgeCode" severity="danger" icon="pi pi-sign-out"
                :label="$t('public.judge.changeButton')" @click.prevent.stop="changeJudge" />
              <LocaleMenu />
            </div>
            <PrimeButton v-if="match && judge" @click.prevent="showSubmit" :disabled="!canSubmit"
              :label="$t('public.judge.submit')" :severity="hasMajor ? 'danger' : 'success'" />
          </div>
        </template>
      </ScoreTable>
    </div>
  </PublicContainer>
  <PrimeConfirmDialog group="forgottenWarning" :closable="false">
    <template #message="slotProps">
      <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
        <i :class="slotProps.message.icon" class="text-6xl text-red-500 dark:text-red-40"></i>
        <p class="text-red-500 dark:text-red-40">{{ slotProps.message.message }}</p>
      </div>
    </template>
  </PrimeConfirmDialog>
  <PrimeConfirmDialog group="submit" :closable="false"></PrimeConfirmDialog>
</template>

<script setup>
import { clone } from 'lodash-es';
import { useLocalStorage } from '@vueuse/core';

import { calculateHasMajor, getGroupName, handleServerError, moveList } from '~/src/utils';
import { StatusEvents } from '~/src/event-sources';

definePageMeta({
  layout: 'public'
});

const DEFAULT_SCORES = { id: '', judgeNumber: -1, points: [] };

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();
const scores = useLocalStorage(`scores`, clone(DEFAULT_SCORES));
const toast = useToast();
const confirm = useConfirm();

const inviteCode = computed(() => route.params.invite);
const matNumber = computed(() => route.params.mat);
const judgeNumber = computed(() => route.params.judge);

const judgeInput = ref('');
const error = ref('');
const inAction = ref(true);

const moves = computed(() => group.value ? moveList(group.value.kata) : []);

const judgeCode = computed({
  get() {
    return cookie.value.jCode;
  },
  set(value) {
    cookie.value.jCode = value;
  }
});

const status = computed(() => {
  if (codeError.value) {
    return '';
  }
  if (inAction.value) {
    return 'Loading...'
  }
  if (!tournament.value) {
    return error.value;
  }
  if (!group.value && !match.value) {
    return 'No more matches';
  }
  if (judgeNumber.value > group.value.numberOfJudges) {
    return 'Invalid Judge Position';
  }
  if (!match.value.completed && state.value[judgeNumber.value - 1]) {
    return 'Please wait until all judges have submitted their score...';
  }

  if (scores.value.points.length === 0) {
    return 'Loading next match...'
  }
  return '';
});

const canSubmit = computed(() => {
  return scores.value.points.every((score) => score.dirty);
});

const hasMajor = computed(() => calculateHasMajor(scores.value.points));
const codeError = computed(() => judgeError.value ? handleServerError(judgeError.value) : '');

const { data: judge, error: judgeError, clear: clearJudge } = await useAsyncData('judge', () => {
  if (judgeCode.value) {
    return $fetch(`/api/invites/${inviteCode.value}/${matNumber.value}/${judgeCode.value}`);
  }
}, { watch: [judgeCode] });

const { data, status: dataStatus, error: dataError, refresh: refreshData, clear: clearData } = await useAsyncData('match', () => {
  return $fetch(`/api/invites/${inviteCode.value}/${matNumber.value}/match`);
}, { watch: [judge] });

const tournament = computed(() => data.value ? data.value.tournament : undefined);
const group = computed(() => data.value ? data.value.group : undefined);
const match = computed(() => data.value ? data.value.match : undefined);
const state = computed(() => data.value ? data.value.state : undefined);

watch(match, () => {
  if (match.value) {
    inAction.value = false;
  }
  if (group.value) {
    if (scores.value.points.length === 0 || judgeNumber.value !== scores.value.judgeNumber) {
      scores.value.points = Array(moves.value.length).fill('').map(() => ({ deductions: Array(6).fill('') }));
      scores.value.judgeNumber = judgeNumber.value;
    }
  }
}, { immediate: true });

async function submitCode() {
  judgeCode.value = judgeInput.value;
}

async function changeJudge() {
  clearJudge();
  judgeInput.value = '';
  judgeCode.value = '';
  scores.value.id = '';
  scores.value.points = [];
}

async function showSubmit() {
  confirm.require({
    group: 'submit',
    header: 'Submit scores?',
    message: 'This can not be undone.',
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: () => {
      submitScore();
    },
  });
}

async function submitScore() {
  try {
    const body = _scoreToPayload();
    const state = await $fetch(`/api/invites/${inviteCode.value}/${matNumber.value}/submit`, { method: 'POST', body });
    scores.value.points = [];
    data.value.state = state;
    const complete = state.every((s) => s);
    if (complete) {
      refreshData();
      return;
    }
    let event = new StatusEvents(matNumber.value, inviteCode.value);
    event.connect((data) => {
      const complete = data.every((s) => s);
      if (complete) {
        event.close();
        refreshData();
      }
    });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: handleServerError(err), life: 5000 });
  }
}

function _scoreToPayload() {
  const payload = { id: match.value.id, judgeNumber: judgeNumber.value };
  const judgeData = { id: judge.value.id, name: judge.value.name, scores: [] };
  for (const score of scores.value.points) {
    judgeData.scores.push({ deductions: (score.deductions || Array(6).fill('')).join(':') });
  }
  payload.judge = judgeData;
  return payload;
}
</script>
