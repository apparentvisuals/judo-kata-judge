<template>
  <div v-if="error" class="toast toast-top">
    <div class="alert alert-error">
      <h1 class="text-xl font-bold uppercase">{{ error }}</h1>
    </div>
  </div>
  <div class="bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-primary shadow-xl">
      <div class="navbar-start text-primary-content">
        <button class="btn btn-square btn-ghost" @click.prevent="navigateTo('/admin')">
          <ArrowLeftIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="navbar-center text-primary-content">
        <div class="normal-case text-xl pl-4">{{ `${tournament.name} (${tournament.id})` }}</div>
      </div>
      <div class="navbar-end text-primary-content">
        <button class="btn btn-square btn-ghost btn-sm" @click.prevent="addMat" aria-label="add mat">
          <PlusIcon class="w-6 h-6" />
        </button>
        <button class="btn btn-ghost btn-sm" @click.prevent="save">
          Save
        </button>
      </div>
    </div>
    <div class="p-2 flex flex-col gap-2">
      <div v-for="(mat, matIndex) in tournament.mats" class="bg-base-100 border">
        <div class="flex justify-between mb-2 p-2">
          <h2 class="text-lg font-semibold">Mat {{ matIndex + 1 }}</h2>
          <div class="join">
            <button class="btn btn-square btn-sm btn-primary join-item" @click.prevent="showAddGroup(matIndex)"
              aria-label="add group">
              <PlusIcon class="w-6 h-6" />
            </button>
            <button class="btn btn-square btn-sm btn-error join-item" @click.prevent="deleteMat(matIndex)"
              aria-label="delete mat">
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
                    @click.prevent="showAddMatch(matIndex, groupIndex)" aria-label="add match">
                    <PlusIcon class="w-5 h-5" />
                  </button>
                  <button class="btn btn-square btn-sm btn-success join-item"
                    :disabled="!canRandomize(matIndex, groupIndex)" @click.prevent="randomizeGroup(matIndex, groupIndex)"
                    aria-label="randomize matches in group">
                    <ArrowPathIcon class="w-5 h-5" />
                  </button>
                  <button class="btn btn-primary btn-square btn-sm join-item"
                    @click.prvent="showUpdateGroup(matIndex, groupIndex, group)">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button class="btn btn-square btn-sm btn-error join-item"
                    @click.prevent="deleteGroup(matIndex, groupIndex)" aria-label="delete group">
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
                          <button class="btn btn-primary btn-square btn-sm join-item" :disabled="!match.completed">
                            <CheckIcon class="w-5 h-5" />
                          </button>
                          <button class="btn btn-primary btn-square btn-sm join-item"
                            @click.prvent="showUpdateMatch(matIndex, groupIndex, index, match)"
                            :disabled="match.completed || inAction">
                            <PencilIcon class="w-4 h-4" />
                          </button>
                          <button class="btn btn-square btn-sm btn-error join-item" alt="delete match">
                            <XMarkIcon class="w-5 h-5" @click.prevent="deleteMatch(matIndex, groupIndex, index)" />
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
    <Prompt name="add_group_modal" @submit="addGroup" :disabled="inAction" text="Add">
      <GroupInput :group="newGroup" />
    </Prompt>
    <Prompt name="edit_group_modal" @submit="updateGroup" :disabled="inAction" text="update">
      <GroupInput :group="groupToUpdate" />
    </Prompt>
    <Prompt name="add_match_modal" @submit="addMatch" :disabled="inAction" text="Add">
      <MatchInput :match="newMatch" :athletes="athletes" />
    </Prompt>
    <Prompt name="edit_match_modal" @submit="updateMatch" :disabled="inAction" text="Update">
      <MatchInput :match="matchToUpdate" :athletes="athletes" />
    </Prompt>
  </div>
</template>

<script setup>
import { clone, pick } from 'lodash-es';
import { XMarkIcon, ArrowLeftIcon, PencilIcon, PlusIcon, CheckIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { getGroupName, handleServerError } from '~/src/utils';

const DEFAULT_GROUP = { name: '', kata: '', numberOfJudges: 5, startTime: '' };
const DEFAULT_MATCH = { tori: '', uke: '' };

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const inAction = useState('in-action', () => false);
const tournament = useState('tournament', () => ({}));
const athletes = useState('athletes', () => []);
const newGroup = useState('new-group', () => clone(DEFAULT_GROUP));
const newMatch = useState('new-match', () => clone(DEFAULT_MATCH));
const mat = useState('mat', () => undefined);
const group = useState('group', () => undefined);
const match = useState('match', () => undefined);
const groupToUpdate = useState('group-to-update', () => clone(DEFAULT_GROUP));
const matchToUpdate = useState('match-to-update', () => clone(DEFAULT_MATCH));

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

async function addMat() {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m`, { method: 'POST', headers });
  tournament.value = response;
}

async function deleteMat(mat) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}`, { method: 'DELETE', headers });
  tournament.value = response;
}

async function save() {
  const body = tournament.value;
  await $fetch(`/api/tournaments/${route.params.tournament}`, { method: 'POST', body, headers });
}

async function showAddGroup(matIndex) {
  mat.value = matIndex;
  add_group_modal.showModal();
}

async function addGroup() {
  const body = newGroup.value;
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g`, { method: 'POST', body, headers });
  tournament.value = response;
  newGroup.value.name = '';
}

function canRandomize(matIndex, groupIndex) {
  const matches = tournament.value.mats[matIndex].groups[groupIndex].matches;
  return matches.every((match) => !match.completed);
}

function randomizeGroup(matIndex, groupIndex) {
  const matches = tournament.value.mats[matIndex].groups[groupIndex].matches;
  _shuffle(matches);
}

async function showUpdateGroup(matIndex, groupIndex, groupValue) {
  mat.value = matIndex;
  group.value = groupIndex;
  groupToUpdate.value = clone(groupValue);
  edit_group_modal.showModal();
}

async function updateGroup() {
  const body = pick(groupToUpdate.value, ["name", "kata", "numberOfJudges", "startTime"]);
  const result = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g/${group.value}`, { method: 'POST', body, headers });
  tournament.value = result;
}

async function deleteGroup(mat, group) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}`, { method: 'DELETE', headers });
  tournament.value = response;
}

async function showAddMatch(selectedMat, selectedGroup) {
  mat.value = selectedMat;
  group.value = selectedGroup;
  add_match_modal.showModal();
}

async function addMatch() {
  const body = newMatch.value;
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g/${group.value}/match`, { method: 'POST', body, headers });
  tournament.value = response;
  newMatch.value.tori = '';
  newMatch.value.uke = '';
}

async function showUpdateMatch(selectedMat, selectedGroup, selectedMatch, matchValue) {
  mat.value = selectedMat;
  group.value = selectedGroup;
  match.value = selectedMatch;
  matchToUpdate.value.tori = matchValue.tori;
  matchToUpdate.value.uke = matchValue.uke;
  matchToUpdate.value.toriId = matchValue.toriId;
  matchToUpdate.value.ukeId = matchValue.ukeId;
  edit_match_modal.showModal();
}

async function updateMatch() {
  const body = pick(matchToUpdate.value, ['uke', 'ukeId', 'tori', 'toriId']);
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g/${group.value}/match/${match.value}`, { method: 'POST', body, headers });
  tournament.value = response;
}

async function deleteMatch(mat, group, matchId) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchId}`, { method: 'DELETE', headers });
  tournament.value = response;
}

function _shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
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
  tournament.value = await $fetch(`/api/tournaments/${route.params.tournament}`, { headers });
  athletes.value = await $fetch(`/api/athletes`, { headers });
} catch (err) {
  _setError(handleServerError(err));
}
</script>
