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
            @click.prevent="cloneT" class="mr-2"></PrimeButton>
          <PrimeButton severity="danger" v-if="isReordering" :label="$t('buttons.cancel')" @click.prevent="cancel"
            :aria-label="$t('buttons.cancel')" class="mr-2"></PrimeButton>
          <PrimeButton icon="pi pi-sort" :label="isReordering ? $t('buttons.save') : $t('buttons.reorder')"
            @click.prevent="save" :aria-label="isReordering ? $t('buttons.save') : $t('buttons.reorder')">
          </PrimeButton>
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
    <Prompt name="delete_mat_modal" @submit="deleteMat" text="Yes">
      <span>Delete this mat?</span>
    </Prompt>
    <Prompt name="add_group_modal" @submit="addGroup" :disabled="inAction" text="Add">
      <GroupInput :group="newGroup" />
    </Prompt>
    <Prompt name="edit_group_modal" @submit="updateGroup" :disabled="inAction" text="update">
      <GroupInput :group="groupToUpdate" />
    </Prompt>
    <Prompt name="delete_group_modal" @submit="deleteGroup" text="Yes">
      <span>Delete this group?</span>
    </Prompt>
    <Prompt name="add_match_modal" @submit="addMatch" :disabled="inAction" text="Add">
      <MatchInput :match="newMatch" :athletes="athletes" />
    </Prompt>
    <Prompt name="edit_match_modal" @submit="updateMatch" :disabled="inAction" text="Update">
      <MatchInput :match="matchToUpdate" :athletes="athletes" />
    </Prompt>
    <Prompt name="delete_match_modal" @submit="deleteMatch" text="Yes">
      <span>Delete this match?</span>
    </Prompt>
    <Prompt name="view_invite_modal" text="Close" :cancellable="false">
      <div class="flex flex-col items-center">
        <QR :path="invitePath" :title="$t('buttons.inviteLink')" />
      </div>
    </Prompt>
  </ClientOnly>
</template>

<script setup>
import { clone, omit } from 'lodash-es';
import { ArrowsUpDownIcon, XMarkIcon, ArrowLeftIcon, PencilIcon, PlusIcon, ArrowPathIcon, DocumentTextIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';

import { getGroupName, handleServerError, shuffle } from '~/src/utils';

const DEFAULT_GROUP = { name: '', kata: '', numberOfJudges: 5, startTime: '' };
const DEFAULT_MATCH = { tori: '', uke: '' };

const route = useRoute();
const tournamentId = computed(() => route.params.tournament);

const cookie = useCookie('jkj', { default: () => ({}) });
const headers = computed(() => ({ authorization: `Bearer ${cookie.value.adminCode}` }));

const error = ref('');
const inAction = ref(false);
const newGroup = ref(clone(DEFAULT_GROUP));
const newMatch = ref(clone(DEFAULT_MATCH));
const matToEdit = ref();
const groupToEdit = ref();
const matchToEdit = ref();
const groupToUpdate = ref(clone(DEFAULT_GROUP));
const matchToUpdate = ref(clone(DEFAULT_MATCH));
const isReordering = ref(false);

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
  view_invite_modal.showModal();
}

async function cloneT() {
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/clone`, { headers: headers.value });
  await navigateTo(`/admin/t/${response.id}`, { replace: true });
}

async function showDeleteMat(matIndex) {
  matToEdit.value = matIndex;
  delete_mat_modal.showModal();
}

async function deleteMat() {
  const mat = matToEdit.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}`, { method: 'DELETE', headers: headers.value });
  tournament.value = response;
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
  add_group_modal.showModal();
}

async function addGroup() {
  const mat = matToEdit.value;
  const body = newGroup.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g`, { method: 'POST', body, headers: headers.value });
  tournament.value = response;
  newGroup.value.name = '';
}

async function showUpdateGroup(matIndex, groupIndex, groupValue) {
  matToEdit.value = matIndex;
  groupToEdit.value = groupIndex;
  groupToUpdate.value = clone(omit(groupValue, 'matches'));
  edit_group_modal.showModal();
}

async function updateGroup() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const body = groupToUpdate.value;
  const result = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}`, { method: 'POST', body, headers: headers.value });
  tournament.value = result;
}

async function showDeleteGroup(matIndex, groupIndex) {
  matToEdit.value = matIndex;
  groupToEdit.value = groupIndex;
  delete_group_modal.showModal();
}

async function deleteGroup() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}`, { method: 'DELETE', headers: headers.value });
  tournament.value = response;
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
  add_match_modal.showModal();
}

async function addMatch() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const body = newMatch.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}/match`, { method: 'POST', body, headers: headers.value });
  tournament.value = response;
  newMatch.value.tori = '';
  newMatch.value.uke = '';
}

async function showUpdateMatch(selectedMat, selectedGroup, selectedMatch, matchValue) {
  matToEdit.value = selectedMat;
  groupToEdit.value = selectedGroup;
  matchToEdit.value = selectedMatch;
  matchToUpdate.value = clone(omit(matchValue, ['scores']));
  edit_match_modal.showModal();
}

async function updateMatch() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const match = matchToEdit.value;
  const body = matchToUpdate.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}/match/${match}`, { method: 'POST', body, headers: headers.value });
  tournament.value = response;
}

async function showDeleteMatch(selectedMat, selectedGroup, selectedMatch) {
  matToEdit.value = selectedMat;
  groupToEdit.value = selectedGroup;
  matchToEdit.value = selectedMatch;
  delete_match_modal.showModal();
}

async function deleteMatch() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const match = matchToEdit.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}/g/${group}/match/${match}`, { method: 'DELETE', headers: headers.value });
  tournament.value = response;
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
