<template>
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
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="p-2 flex flex-col gap-2">
      <div v-for="(mat, matIndex) in tournament.mats" class="bg-base-100">
        <div class="flex justify-between mb-2 p-2">
          <h2 class="text-lg font-semibold">Mat {{ matIndex + 1 }}</h2>
          <div class="flex">
            <button class="btn btn-square btn-sm btn-primary mr-1" @click.prevent="showAddGroup(matIndex)"
              aria-label="add group" @submit="addGroup">
              <PlusIcon class="w-6 h-6" />
            </button>
            <button class="btn btn-square btn-sm btn-error" @click.prevent="deleteMat(matIndex)" aria-label="delete mat">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
        <draggable v-model="mat.groups" tag="div" group="groups" item-key="name" class="flex flex-col gap-2 p-2">
          <template #item="{ element: group, index: groupIndex }">
            <div class="bg-base-100 p-2 border">
              <div class="flex justify-between mb-2">
                <h2 class="text-lg font-semibold">{{ getGroupName(group, groupIndex) }}</h2>
                <div class="flex">
                  <button class="btn btn-square btn-sm btn-primary mr-1"
                    @click.prevent="showAddMatch(matIndex, groupIndex)" aria-label="add match">
                    <PlusIcon class="w-6 h-6" />
                  </button>
                  <button class="btn btn-square btn-sm btn-error" @click.prevent="deleteGroup(matIndex, groupIndex)"
                    aria-label="delete group">
                    <XMarkIcon class="w-6 h-6" />
                  </button>
                </div>
              </div>
              <table class="table w-full border">
                <thead>
                  <tr>
                    <th>Tori</th>
                    <th>Uke</th>
                    <th class="w-32">Kata</th>
                    <th class="w-8"></th>
                  </tr>
                </thead>
                <draggable v-model="group.matches" tag="tbody" group="matches" item-key="tori">
                  <template #item="{ element: match, index }">
                    <tr class="bg-base-100">
                      <td>{{ match.tori }}</td>
                      <td>{{ match.uke }}</td>
                      <td>
                        <div>{{ getKataName(match.kata) }}</div>
                      </td>
                      <td>
                        <button class="btn btn-square btn-sm btn-error" alt="delete match">
                          <XMarkIcon class="w-4 h-4" @click.prevent="deleteMatch(matIndex, groupIndex, index)" />
                        </button>
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
    <GroupModal v-model="addingGroup" :data="newGroup" @submit="addGroup" />
    <MatchModal v-model="addingMatch" :data="newMatch" @submit="addMatch" />
  </div>
</template>

<script setup>
import { XMarkIcon, ArrowLeftIcon, PencilIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { format } from 'date-fns';
import { KATA_MAP, getKataName, getGroupName, handleServerError } from '~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const tournament = useState('tournament', () => ({}));
const addingMatch = useState('adding-match', () => false);
const newMatch = useState('new-match', () => ({ tori: '', uke: '', kata: 'nnk', numberOfJudges: 5 }));
const addingGroup = useState('adding-group', () => false);
const newGroup = useState('new-group', () => ({ name: '', kata: '', numberOfJudges: 5 }));
const mat = useState('mat', () => 0);
const group = useState('group', () => 0);
const error = useState('error', () => '');

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

try {
  tournament.value = await $fetch(`/api/tournaments/${route.params.tournament}`, { headers });
} catch (err) {
  error.value = handleServerError(err);
}

async function showAddGroup(selectedMat) {
  mat.value = selectedMat;
  addingGroup.value = true;
}

async function showAddMatch(selectedMat, selectedGroup) {
  mat.value = selectedMat;
  group.value = selectedGroup;
  const groupValue = tournament.value.mats[selectedMat].groups[selectedGroup];
  if (groupValue.kata) {
    newMatch.value.kata = groupValue.kata;
  }
  if (groupValue.numberOfJudges) {
    newMatch.value.numberOfJudges = groupValue.numberOfJudges;
  }
  addingMatch.value = true;
}

async function save() {
  const body = tournament.value;
  await $fetch(`/api/tournaments/${route.params.tournament}`, { method: 'POST', body, headers });
}

async function addMat() {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m`, { method: 'POST', headers });
  tournament.value = response;
}

async function deleteMat(mat) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}`, { method: 'DELETE', headers });
  tournament.value = response;
}

async function addGroup() {
  const body = newGroup.value;
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g`, { method: 'POST', body, headers });
  tournament.value = response;
  addingGroup.value = false;
  newGroup.value.name = '';
}

async function deleteGroup(mat, group) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}`, { method: 'DELETE', headers });
  tournament.value = response;
}

async function addMatch() {
  const body = { ...newMatch.value, scores: Array(newMatch.value.numberOfJudges).fill({}) };
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g/${group.value}/match`, { method: 'POST', body, headers });
  tournament.value = response;
  addingMatch.value = false;
  newMatch.value.tori = '';
  newMatch.value.uke = '';
}

async function deleteMatch(mat, group, matchId) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchId}`, { method: 'DELETE', headers });
  tournament.value = response;
}
</script>
