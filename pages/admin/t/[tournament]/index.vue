<template>
  <Error :error-string="error" />
  <div class="navbar fixed bg-primary shadow-xl">
    <div class="navbar-start text-primary-content">
      <NuxtLink class="btn btn-square btn-ghost" to="/admin">
        <ArrowLeftIcon class="w-6 h-6" />
      </NuxtLink>
    </div>
    <div class="navbar-center text-primary-content">
      <div class="normal-case text-xl pl-4">{{ `${tournament.name} (${tournament.id})` }}</div>
    </div>
    <div class="navbar-end">
    </div>
  </div>
  <Container>
    <div
      class="font-bold border p-4 bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-white/80">
      <ActionBar>
        <button class="btn btn-secondary" @click.prevent="addMat" title="Add Mat">
          <PlusIcon class="w-5 h-5" />
          <span>{{ $t('buttons.addMat') }}</span>
        </button>
        <button class="btn btn-secondary" @click.prevent="createInvite" title="Show Invite">
          <EnvelopeIcon class="w-5 h-5" />
          <span>{{ $t('buttons.inviteLink') }}</span>
        </button>
        <div class="flex-1"></div>
        <button class="btn btn-secondary" :aria-label="$t('buttons.makeCopy')" @click.prevent="cloneT">{{
    $t('buttons.makeCopy') }}</button>
        <button v-if="isReordering" class="btn btn-error" @click.prevent="cancel" :aria-label="$t('buttons.cancel')">{{
    $t('buttons.cancel') }}</button>
        <button class="btn btn-secondary" @click.prevent="save"
          :aria-label="isReordering ? $t('buttons.save') : $t('buttons.reorder')">
          {{ isReordering ? $t('buttons.save') : $t('buttons.reorder') }}
        </button>
      </ActionBar>
    </div>
    <Panel v-for="(mat, matIndex) in tournament.mats" toggleable
      :pt="{ content: '!p-2 !rounded-none', header: '!rounded-none' }" :pt-options="{ mergeProps: true }" class="mt-2">
      <template #header>
        <span class="flex items-center gap-2 w-full">
          <h2 class="text-lg font-semibold">Mat {{ matIndex + 1 }}</h2>
          <div class="join ml-auto">
            <button class="btn btn-square btn-sm btn-success join-item" @click.prevent="showAddGroup(matIndex)"
              aria-label="add group" :title="$t('buttons.addGroup')">
              <PlusIcon class="w-6 h-6" />
            </button>
            <button class="btn btn-square btn-sm btn-error join-item" @click.prevent="showDeleteMat(matIndex)"
              aria-label="delete mat" :title="$t('buttons.deleteMat')">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </span>
      </template>
      <draggable v-model="mat.groups" tag="div" group="groups" item-key="name" handle=".handle"
        :disabled="!isReordering">
        <template #item="{ element: group, index: groupIndex }">
          <Panel toggleable :pt="{ content: '!p-2 !rounded-none', header: '!rounded-none' }"
            :pt-options="{ mergeProps: true }" class="mb-2 last:mb-0">
            <template #header>
              <span class="flex items-center gap-2 w-full">
                <ArrowsUpDownIcon v-show="isReordering" class="handle w-6 h-6" />
                <span class="text-lg font-semibold">{{ getGroupName(group, groupIndex) }}</span>
                <Chip>Judges: {{ group.numberOfJudges }}</Chip>
                <Chip v-if="group.startTime">
                  Start Time: {{ group.startTime }}
                </Chip>
                <div class="join ml-auto">
                  <button class="btn btn-square btn-sm btn-success join-item"
                    @click.prevent="showAddMatch(matIndex, groupIndex)" aria-label="add match"
                    :title="$t('buttons.addMatch')">
                    <PlusIcon class="w-5 h-5" />
                  </button>
                  <button class="btn btn-square btn-sm btn-success join-item"
                    :disabled="!canRandomize(matIndex, groupIndex)"
                    @click.prevent="randomizeGroup(matIndex, groupIndex)" aria-label="randomize matches in group"
                    :title="$t('buttons.randomize')">
                    <ArrowPathIcon class="w-5 h-5" />
                  </button>
                  <button class="btn btn-primary btn-square btn-sm join-item"
                    @click.prvent="showUpdateGroup(matIndex, groupIndex, group)" :title="$t('buttons.editGroup')">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button class="btn btn-square btn-sm btn-error join-item"
                    @click.prevent="showDeleteGroup(matIndex, groupIndex)" aria-label="delete group"
                    :title="$t('buttons.deleteGroup')">
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </span>
            </template>
            <table class="w-full border-spacing-0 border-separate" role="table">
              <thead>
                <tr>
                  <th
                    class="font-bold text-left first:border-l border-y border-r border-0 border-b border-solid p-4 bg-surface-50 text-surface-700 dark:text-white/80 dark:bg-surface-800 border-surface-200 dark:border-surface-700 focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50 w-12"
                    v-if="isReordering"></th>
                  <th
                    class="font-bold text-left first:border-l border-y border-r border-0 border-b border-solid p-4 bg-surface-50 text-surface-700 dark:text-white/80 dark:bg-surface-800 border-surface-200 dark:border-surface-700 focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50 w-1/2">
                    Tori</th>
                  <th
                    class="font-bold text-left first:border-l border-y border-r border-0 border-b border-solid p-4 bg-surface-50 text-surface-700 dark:text-white/80 dark:bg-surface-800 border-surface-200 dark:border-surface-700 focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50 w-1/2">
                    Uke</th>
                  <th
                    class="font-bold text-left first:border-l border-y border-r border-0 border-b border-solid p-4 bg-surface-50 text-surface-700 dark:text-white/80 dark:bg-surface-800 border-surface-200 dark:border-surface-700 focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50 w-20">
                  </th>
                </tr>
              </thead>
              <draggable v-model="group.matches" tag="tbody" group="matches" item-key="tori" handle=".handle"
                :disabled="!isReordering">
                <template #item="{ element: match, index }">
                  <tr class="dark:text-white/80 bg-surface-0 text-surface-600 dark:bg-surface-800">
                    <td v-if="isReordering"
                      class="text-left border-0 border-b border-solid first:border-l border-r p-4 border-surface-200 dark:border-surface-700">
                      <ArrowsUpDownIcon class="handle w-6 h-6" />
                    </td>
                    <td
                      class="text-left border-0 border-b border-solid first:border-l border-r border-b p-4 border-surface-200 dark:border-surface-700">
                      <div>{{ match.tori }}</div>
                      <div class="sm:hidden">{{ match.uke }}</div>
                    </td>
                    <td
                      class="text-left border-0 border-b border-solid first:border-l border-r border-b p-4 border-surface-200 dark:border-surface-700">
                      {{ match.uke }}</td>
                    <td
                      class="text-left border-0 border-b border-solid first:border-l border-r border-b p-4 border-surface-200 dark:border-surface-700">
                      <div class="join">
                        <NuxtLink class="btn btn-primary btn-square btn-sm join-item"
                          :to="`/admin/t/${tournament.id}/${matIndex}/${groupIndex}/${index}`" target="_blank"
                          :title="$t('buttons.results')">
                          <DocumentTextIcon class="w-5 h-5" />
                        </NuxtLink>
                        <button class="btn btn-primary btn-square btn-sm join-item"
                          @click.prvent="showUpdateMatch(matIndex, groupIndex, index, match)"
                          :disabled="match.completed || inAction" :title="$t('buttons.editMatch')">
                          <PencilIcon class="w-4 h-4" />
                        </button>
                        <button class="btn btn-square btn-sm btn-error join-item" alt="delete match"
                          :title="$t('buttons.deleteMatch')">
                          <XMarkIcon class="w-5 h-5" @click.prevent="showDeleteMatch(matIndex, groupIndex, index)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </draggable>
            </table>
          </Panel>
        </template>
      </draggable>
    </Panel>
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
      <ClientOnly>
        <QR :path="invitePath" :title="$t('buttons.inviteLink')" />
      </ClientOnly>
    </div>
  </Prompt>
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
