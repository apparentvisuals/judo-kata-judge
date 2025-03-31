<template>
  <div v-if="status"
    class="fixed top-16 bottom-0 w-full flex flex-col items-center justify-center  text-surface-800 dark:text-surface-200">
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
  <PublicContainer v-else-if="match" class="pt-0">
    <div class="grow" style="height: 300px">
      <ScoreTable :match="match" :group="group" :scores="scores">
        <template #header>
          <div class="flex justify-between">
            <div class="text-xl hidden md:block">
              {{ match.tori }} / {{ match.uke }}
            </div>
            <div class="flex flex-col items-start">
              <div class="text-xl md:hidden">
                {{ match.tori }} / {{ match.uke }}
              </div>
              <div class="text-xl">{{ match ? getGroupName(group) : '' }}</div>
            </div>
            <div class="text-xl font-bold" v-if="match && group">
              {{ judge.name }} ({{ judgeNumber }})
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
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
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { calculateHasMajor, getGroupName, handleServerError, moveList } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

definePageMeta({
  layout: 'public'
});

const DEFAULT_SCORES = { id: '', points: [] };

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();
const scores = useLocalStorage(`scores`, clone(DEFAULT_SCORES));
const toast = useToast();
const confirm = useConfirm();

const inviteCode = computed(() => route.params.invite);
const matNumber = computed(() => route.params.mat);
const judgeNumber = computed(() => route.params.judge);

const error = ref('');
const tournament = ref(undefined);
const match = ref(undefined);
const group = ref(undefined);
const state = ref(undefined);
const codeError = ref('');
const loading = ref(true);
const judge = ref(undefined);
const inAction = ref(false);

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
  return scores.value.points.every((score) => score.value != null && score.value !== 10);;
});
const hasMajor = computed(() => calculateHasMajor(scores.value.points));

async function submitCode() {
  try {
    inAction.value = true;
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
    inAction.value = true;
    const body = _scoreToPayload();
    const response = await $fetch(`/api/invites/${inviteCode.value}/${matNumber.value}/${judgeNumber.value}`, { method: 'POST', body });
    state.value = response;
    scores.value.points = Array(moves.value.length).fill('').map(() => ({ deductions: Array(6).fill('') }));
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: handleServerError(err), life: 5000 });
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
    loading.value = false;
    if (data.error) {
      toast.add({ severity: 'error', summary: 'Error', detail: data.error, life: 5000 });
      event.close();
      return;
    }

    if (data.tournament) {
      tournament.value = data.tournament;
    }
    group.value = data.group;
    match.value = data.match;
    state.value = data.state;

    if (data.matchIndex !== scores.value.matchIndex || data.groupIndex !== scores.value.groupIndex) {
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
