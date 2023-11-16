<template>
  <div v-if="error" class="toast toast-top">
    <div class="alert alert-error">
      <h1 class="text-xl font-bold uppercase">{{ error }}</h1>
    </div>
  </div>
  <div class="bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-primary shadow-xl">
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
    <div class="m-4">
      <div class="pb-4 flex flex-row gap-2">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="addMat" title="Create Tournament">
          <PlusIcon class="w-5 h-5" />
          <span>Add Mat</span>
        </button>
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="createInvite" title="Create Invite">
          <EnvelopeIcon class="w-5 h-5" />
          <span>View Invite Link</span>
        </button>
        <div class="flex-1"></div>
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="save" title="Save">
          Save
        </button>
      </div>
      <div class="flex flex-col gap-4">
        <div v-for="(mat, matIndex) in tournament.mats" class="bg-base-100 border">
          <div class="flex justify-between mb-2 p-2">
            <h2 class="text-lg font-semibold">Mat {{ matIndex + 1 }}</h2>
            <div class="join">
              <button class="btn btn-square btn-sm btn-primary join-item" @click.prevent="showAddGroup(matIndex)"
                aria-label="add group" title="Add Group">
                <PlusIcon class="w-6 h-6" />
              </button>
              <button class="btn btn-square btn-sm btn-error join-item" @click.prevent="showDeleteMat(matIndex)"
                aria-label="delete mat" title="Delete Mat">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>
          <draggable v-model="mat.groups" tag="div" group="groups" item-key="name" class="flex flex-col gap-2 p-2">
            <template #item="{ element: group, index: groupIndex }">
              <div class="bg-base-100 p-2 border">
                <div class="flex justify-between mb-2">
                  <div>
                    <span class="text-lg font-semibold">{{ getGroupName(group, groupIndex) }}</span>
                    <div class="flex gap-2">
                      <div class="badge badge-info">Judges: {{ group.numberOfJudges }}</div>
                      <div v-if="group.startTime" class="badge badge-info">Start Time: {{ group.startTime }}</div>
                    </div>
                  </div>
                  <div class="join">
                    <button class="btn btn-square btn-sm btn-success join-item"
                      @click.prevent="showAddMatch(matIndex, groupIndex)" aria-label="add match" title="Add Match">
                      <PlusIcon class="w-5 h-5" />
                    </button>
                    <button class="btn btn-square btn-sm btn-success join-item"
                      :disabled="!canRandomize(matIndex, groupIndex)"
                      @click.prevent="randomizeGroup(matIndex, groupIndex)" aria-label="randomize matches in group"
                      title="Randomize Matches">
                      <ArrowPathIcon class="w-5 h-5" />
                    </button>
                    <button class="btn btn-primary btn-square btn-sm join-item"
                      @click.prvent="showUpdateGroup(matIndex, groupIndex, group)" title="Edit Group">
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button class="btn btn-square btn-sm btn-error join-item"
                      @click.prevent="showDeleteGroup(matIndex, groupIndex)" aria-label="delete group"
                      title="Delete Group">
                      <XMarkIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <table class="table w-full border">
                  <thead>
                    <tr>
                      <th class="sm:w-1/2">Tori</th>
                      <th class="hidden sm:table-cell sm:w-1/2">Uke</th>
                      <th class="w-8"></th>
                    </tr>
                  </thead>
                  <draggable v-model="group.matches" tag="tbody" group="matches" item-key="tori">
                    <template #item="{ element: match, index }">
                      <tr class="bg-base-100">
                        <td>
                          <div>{{ match.tori }}</div>
                          <div class="sm:hidden">{{ match.uke }}</div>
                        </td>
                        <td class="hidden sm:table-cell">{{ match.uke }}</td>
                        <td>
                          <div class="join">
                            <NuxtLink class="btn btn-primary btn-square btn-sm join-item"
                              :class="match.completed ? '' : 'btn-disabled'"
                              :to="`/admin/t/${tournament.id}/${matIndex}/${groupIndex}/${index}`" target="_blank">
                              <CheckIcon class="w-5 h-5" />
                            </NuxtLink>
                            <button class="btn btn-primary btn-square btn-sm join-item"
                              @click.prvent="showUpdateMatch(matIndex, groupIndex, index, match)"
                              :disabled="match.completed || inAction" title="Edit Match">
                              <PencilIcon class="w-4 h-4" />
                            </button>
                            <button class="btn btn-square btn-sm btn-error join-item" alt="delete match"
                              title="Delete Match">
                              <XMarkIcon class="w-5 h-5" @click.prevent="showDeleteMatch(matIndex, groupIndex, index)" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </draggable>
                </table>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
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
    <ClientOnly>
      <Prompt v-if="inviteLink" name="view_invite_modal" text="Close">
        <div class="flex flex-col items-center">
          <img :src="qrCode" alt="invite link QR code" class="w-48" />
          <NuxtLink class="btn-link" :to="inviteLink" target="_blank">{{ invite }}</NuxtLink>
        </div>
      </Prompt>
    </ClientOnly>
  </div>
</template>

<script setup>
import { clone, omit, pick } from 'lodash-es';
import { XMarkIcon, ArrowLeftIcon, PencilIcon, PlusIcon, CheckIcon, ArrowPathIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { getGroupName, handleServerError, shuffle } from '~/src/utils';

const DEFAULT_GROUP = { name: '', kata: '', numberOfJudges: 5, startTime: '' };
const DEFAULT_MATCH = { tori: '', uke: '' };

const route = useRoute();
const tournamentId = computed(() => route.params.tournament);

const cookie = useCookie('jkj', { default: () => ({}) });
const headers = computed(() => ({ authorization: `Bearer ${cookie.value.adminCode}` }));

const error = ref('');
const inAction = ref(false);
const tournament = ref({});
const athletes = ref([]);
const newGroup = ref(clone(DEFAULT_GROUP));
const newMatch = ref(clone(DEFAULT_MATCH));
const matToEdit = ref();
const groupToEdit = ref();
const matchToEdit = ref();
const groupToUpdate = ref(clone(DEFAULT_GROUP));
const matchToUpdate = ref(clone(DEFAULT_MATCH));
const invite = computed(() => {
  if (tournament.value.invites) {
    const inviteCodes = Object.keys(tournament.value.invites);
    if (inviteCodes.length > 0) {
      return inviteCodes[0];
    }
  }
});
const inviteLink = computed(() => {
  if (invite.value) {
    return `/i/${invite.value}`;
  }
});
const qrCode = useQRCode(inviteLink);

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

async function showDeleteMat(matIndex) {
  matToEdit.value = matIndex;
  delete_mat_modal.showModal();
}

async function deleteMat() {
  const mat = matToEdit.value;
  const response = await $fetch(`/api/tournaments/${tournamentId.value}/m/${mat}`, { method: 'DELETE', headers: headers.value });
  tournament.value = response;
}

async function save() {
  const body = tournament.value;
  await $fetch(`/api/tournaments/${tournamentId.value}`, { method: 'POST', body, headers: headers.value });
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
  groupToUpdate.value = clone(groupValue);
  edit_group_modal.showModal();
}

async function updateGroup() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const body = omit(groupToUpdate.value, "matches");
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
  matchToUpdate.value.tori = matchValue.tori;
  matchToUpdate.value.uke = matchValue.uke;
  matchToUpdate.value.toriId = matchValue.toriId;
  matchToUpdate.value.ukeId = matchValue.ukeId;
  edit_match_modal.showModal();
}

async function updateMatch() {
  const mat = matToEdit.value;
  const group = groupToEdit.value;
  const match = matchToEdit.value;
  const body = pick(matchToUpdate.value, ['uke', 'ukeId', 'tori', 'toriId']);
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

try {
  tournament.value = await $fetch(`/api/tournaments/${tournamentId.value}`, { headers: headers.value });
  athletes.value = await $fetch(`/api/athletes`, { headers: headers.value });
} catch (err) {
  _setError(handleServerError(err));
}

</script>
