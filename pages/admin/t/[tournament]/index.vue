<template>
  <Error :error-string="error" />
  <NavBar :menu="false" class="bg-surface-100 dark:bg-surface-900 border-b border-surface-300 dark:border-surface-600">
    <template #left>
      <NuxtLink to="/admin">
        <PrimeButton text icon="pi pi-angle-left text-lg" />
      </NuxtLink>
      <span class="pl-2">{{ `${tournament.name}` }}</span>
    </template>
  </NavBar>
  <ClientOnly>
    <Container class="pt-4">
      <PrimeToolbar>
        <template #start>
          <PrimeButton icon="pi pi-plus" :label="$t('buttons.addMat')" @click.prevent="addMat" title="Add Mat"
            class="mr-2">
          </PrimeButton>
          <PrimeButton icon="pi pi-envelope" :label="$t('buttons.inviteLink')" @click.prevent="createInvite"
            title="Show Invite">
          </PrimeButton>
        </template>
        <template #end>
          <PrimeButton icon="pi pi-copy" :label="$t('buttons.makeCopy')" :title="$t('buttons.makeCopy')"
            @click.prevent="cloneTournament" class="mr-2" />
          <PrimeButton severity="danger" v-if="isReordering" :label="$t('buttons.cancel')" @click.prevent="cancel"
            :aria-label="$t('buttons.cancel')" class="mr-2" />
          <PrimeButton icon="pi pi-sort" :label="isReordering ? $t('buttons.save') : $t('buttons.reorder')"
            @click.prevent="save" :aria-label="isReordering ? $t('buttons.save') : $t('buttons.reorder')" />
        </template>
      </PrimeToolbar>
      <PrimePanel v-for="(mat, matIndex) in tournament.mats" toggleable :pt="{ content: '!p-2' }"
        :pt-options="{ mergeProps: true }" class="mt-2 ring-1 ring-surface-100 dark:ring-surface-700">
        <template #header>
          <span class="flex items-center gap-2 w-full">
            <h2 class="font-medium">Mat {{ matIndex + 1 }}</h2>
            <PrimeButton icon="pi pi-plus" @click.prevent="showAddGroup(matIndex)" :title="$t('buttons.addGroup')">
            </PrimeButton>
            <PrimeButton severity="danger" icon="pi pi-times" @click.prevent="showDeleteMat(matIndex)"
              :title="$t('buttons.deleteMat')">
            </PrimeButton>
          </span>
        </template>
        <draggable v-model="mat.groups" tag="div" group="groups" item-key="name" handle=".handle"
          :disabled="!isReordering">
          <template #item="{ element: group, index: groupIndex }">
            <PrimePanel toggleable :pt="{ content: '!p-2' }" :pt-options="{ mergeProps: true }"
              class="mb-2 last:mb-0 ring-1 ring-surface-100 dark:ring-surface-700">
              <template #header>
                <div class="flex flex-wrap items-center gap-2 w-full">
                  <span v-if="isReordering" class="handle w-6 h-6 pi pi-sort" />
                  <span class="font-medium">{{ getGroupName(group, groupIndex) }}</span>
                  <PrimeChip icon="pi pi-user" :label="group.numberOfJudges.toString()" />
                  <PrimeChip v-if="group.day" icon="pi pi-calendar" :label="group.day" />
                  <PrimeChip v-if="group.startTime" icon="pi pi-calendar-clock" :label="group.startTime" />
                  <div class="flex gap-2">
                    <PrimeButton icon="pi pi-plus" @click.prevent="showAddMatch(matIndex, groupIndex)"
                      :aria-label="$t('buttons.addMatch')" :title="$t('buttons.addMatch')" />
                    <PrimeButton v-if="isReordering" icon="pi pi-sync" :disabled="!canRandomize(matIndex, groupIndex)"
                      @click.prevent="randomizeGroup(matIndex, groupIndex)" :aria-label="$t('buttons.randomize')"
                      :title="$t('buttons.randomize')" />
                    <PrimeButton icon="pi pi-pencil" severity="secondary"
                      @click.prvent="showUpdateGroup(matIndex, groupIndex, group)" :aria-label="$t('buttons.editGroup')"
                      :title="$t('buttons.editGroup')" />
                    <PrimeButton icon="pi pi-times" severity="danger"
                      @click.prevent="showDeleteGroup(matIndex, groupIndex)" :aria-label="$t('buttons.deleteGroup')"
                      :title="$t('buttons.deleteGroup')" />
                  </div>
                </div>
              </template>
              <table class="w-full border-spacing-0 border-separate text-sm" role="table">
                <thead>
                  <tr>
                    <CustomTh v-if="isReordering"></CustomTh>
                    <CustomTh>{{ $t('labels.tori') }}</CustomTh>
                    <CustomTh>{{ $t('labels.uke') }}</CustomTh>
                    <CustomTh class="w-12">{{ $t('labels.actions') }}</CustomTh>
                  </tr>
                </thead>
                <draggable v-model="group.matches" tag="tbody" group="matches" item-key="tori" handle=".handle"
                  :disabled="!isReordering">
                  <template #item="{ element: match, index }">
                    <tr class="dark:text-white/80 bg-surface-0 text-surface-600 dark:bg-surface-800">
                      <CustomTd v-if="isReordering">
                        <ArrowsUpDownIcon class="handle w-6 h-6" />
                      </CustomTd>
                      <CustomTd>
                        <div>{{ match.tori }}</div>
                        <div class="sm:hidden">{{ match.uke }}</div>
                      </CustomTd>
                      <CustomTd>
                        {{ match.uke }}
                      </CustomTd>
                      <CustomTd>
                        <div class="flex justify-center gap-2">
                          <NuxtLink :to="`/admin/t/${tournament.id}/${matIndex}/${groupIndex}/${index}`" target="_blank"
                            :title="$t('buttons.results')">
                            <PrimeButton icon="pi pi-book" />
                          </NuxtLink>
                          <PrimeButton icon="pi pi-pencil" severity="secondary"
                            @click.prvent="showUpdateMatch(matIndex, groupIndex, index, match)"
                            :disabled="match.completed || inAction" :title="$t('buttons.editMatch')" />
                          <PrimeButton icon="pi pi-times" severity="danger"
                            @click.prevent="showDeleteMatch(matIndex, groupIndex, index)"
                            :disabled="match.completed || inAction" :title="$t('buttons.deleteMatch')" />
                        </div>
                      </CustomTd>
                    </tr>
                  </template>
                </draggable>
              </table>
            </PrimePanel>
          </template>
        </draggable>
      </PrimePanel>
    </Container>
    <PrimeConfirmPopup />
    <PrimeDialog v-model:visible="addGroupVisible" modal header="Add Group" class="w-full md:w-1/2 lg:w-1/3">
      <GroupInput @cancel="addGroupVisible = false" @submit="addGroup" />
    </PrimeDialog>
    <PrimeDialog v-model:visible="updateGroupVisible" modal header="Update Group" class="w-full md:w-1/2 lg:w-1/3">
      <GroupInput :group="groupToUpdate" @cancel="updateGroupVisible = false" @submit="updateGroup" />
    </PrimeDialog>
    <PrimeDialog v-model:visible="addMatchVisible" modal header="Add Match" class="w-full md:w-1/2 lg:w-1/3">
      <MatchInput :athletes="athletes" @cancel="addMatchVisible = false" @submit="addMatch" />
    </PrimeDialog>
    <PrimeDialog v-model:visible="updateMatchVisible" modal header="Update Match" class="w-full md:w-1/2 lg:w-1/3">
      <MatchInput :match="matchToUpdate" :athletes="athletes" @cancel="updateMatchVisible = false"
        @submit="updateMatch" />
    </PrimeDialog>
    <PrimeDialog v-model:visible="inviteVisible" modal header="Invitation" class="w-full md:w-[14rem]">
      <QR :path="invitePath" :title="$t('buttons.inviteLink')" />
    </PrimeDialog>
  </ClientOnly>
</template>

<script setup>
import { ArrowsUpDownIcon } from '@heroicons/vue/24/outline';

import { getGroupName, handleServerError, shuffle } from '~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });
const confirm = useConfirm();
const { t } = useI18n();

const error = ref('');
const inAction = ref(false);
const matToEdit = ref();
const groupToEdit = ref();
const matchToEdit = ref();
const groupToUpdate = ref();
const matchToUpdate = ref();
const isReordering = ref(false);
const addGroupVisible = ref(false);
const updateGroupVisible = ref(false);
const addMatchVisible = ref(false);
const updateMatchVisible = ref(false);
const inviteVisible = ref(false);

const tournamentId = computed(() => route.params.tournament);
const headers = computed(() => ({ authorization: `Bearer ${cookie.value.adminCode}` }));

const invite = computed(() => {
  if (tournament.value.invites) {
    const inviteCodes = Object.keys(tournament.value.invites);
    if (inviteCodes.length > 0) {
      return inviteCodes[0];
    }
  }
});
const invitePath = computed(() => {
  if (invite.value) {
    return `/i/${invite.value}`;
  }
});

async function addMat() {
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m`, { method: 'POST', headers: headers.value });
  tournament.value = response;
}

async function createInvite() {
  if (!invite.value) {
    const response = await $fetch(`/api/tournaments/${tournamentId.value}/invite`, { headers: headers.value });
    const newInviteCode = {};
    newInviteCode[response.id] = {};
    tournament.value.invites = Object.assign({}, tournament.value.invites, newInviteCode);
  }
  inviteVisible.value = true;
}

async function cloneTournament() {
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/clone`, { headers: headers.value });
  await navigateTo(`/admin/t/${response.id}`, { replace: true });
}

async function showDeleteMat(mat) {
  confirm.require({
    message: t('prompts.deleteMat'),
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: async () => {
      const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}`, { method: 'DELETE', headers: headers.value });
      tournament.value = response;
    },
    reject: () => { },
  });
}

async function cancel() {
  isReordering.value = false;
}

async function save() {
  if (isReordering.value) {
    const body = _tournamentToPayload(tournament.value);
    try {
      error.value = '';
      const response = await $fetch(`/api/tournaments/${tournamentId.value}`, { method: 'POST', body, headers: headers.value });
      tournament.value = response;
      if (response.upgrade) {
        error.value = 'Tournament was upgraded and no changes was applied. Please make your changes again.';
      }
    } catch (err) {
      error.value = handleServerError(err);
    } finally {
      isReordering.value = false;
    }
  } else {
    isReordering.value = true
  }
}

async function showAddGroup(matIndex) {
  matToEdit.value = matIndex;
  addGroupVisible.value = true;
}

async function addGroup(data) {
  const mat = matToEdit.value;
  const body = data;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g`, { method: 'POST', body, headers: headers.value });
  tournament.value = response;
  addGroupVisible.value = false;
}

async function showUpdateGroup(matIndex, groupIndex, groupValue) {
  matToEdit.value = matIndex;
  groupToEdit.value = groupIndex;
  groupToUpdate.value = groupValue;
  updateGroupVisible.value = true;
}

async function updateGroup(data) {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const body = data;
  body.id = groupToUpdate.value.id;
  const result = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}`, { method: 'POST', body, headers: headers.value });
  tournament.value = result;
  updateGroupVisible.value = false;
}

async function showDeleteGroup(mat, group) {
  confirm.require({
    message: t('prompts.deleteGroup'),
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: async () => {
      const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}`, { method: 'DELETE', headers: headers.value });
      tournament.value = response;
    },
    reject: () => { },
  });
}

function canRandomize(matIndex, groupIndex) {
  const matches = tournament.value.mats[matIndex].groups[groupIndex].matches;
  return matches.every((match) => !match.completed);
}

function randomizeGroup(matIndex, groupIndex) {
  const matches = tournament.value.mats[matIndex].groups[groupIndex].matches;
  shuffle(matches);
}

async function showAddMatch(matIndex, groupIndex) {
  matToEdit.value = matIndex;
  groupToEdit.value = groupIndex;
  addMatchVisible.value = true;
}

async function addMatch(data) {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const body = data;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}/match`, { method: 'POST', body, headers: headers.value });
  tournament.value = response;
  addMatchVisible.value = false;
}

async function showUpdateMatch(selectedMat, selectedGroup, selectedMatch, matchValue) {
  matToEdit.value = selectedMat;
  groupToEdit.value = selectedGroup;
  matchToEdit.value = selectedMatch;
  matchToUpdate.value = matchValue;
  updateMatchVisible.value = true;
}

async function updateMatch(data) {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const match = matchToEdit.value;
  const body = data;
  body.id = matchToUpdate.value.id;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}/match/${match}`, { method: 'POST', body, headers: headers.value });
  tournament.value = response;
  updateMatchVisible.value = false;
}

async function showDeleteMatch(mat, group, match) {
  confirm.require({
    message: t('prompts.deleteMatch'),
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: async () => {
      const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}/match/${match}`, { method: 'DELETE', headers: headers.value });
      tournament.value = response;
    },
    reject: () => { },
  });
}

const { data: tournament, error: tError } = await useFetch(`/api/tournaments/${tournamentId.value}`, { headers: headers.value });
watch(tError, (error) => {
  error.value = handleServerError(err);
});
const { data: athletes, error: aError } = await useFetch(`/api/athletes`, { headers: headers.value });
watch(aError, (error) => {
  error.value = handleServerError(err);
});

function _tournamentToPayload(tournament) {
  return tournament;
}

</script>
