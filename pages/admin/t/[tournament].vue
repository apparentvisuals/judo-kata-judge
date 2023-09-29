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
        <button class="btn btn-square btn-ghost btn-sm" @click.prevent="addMat">
          <PlusIcon />
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
            <!-- <button class="btn btn-square btn-sm mr-1 btn-accent" @click.prevent="showUpdate(index)">
                <PencilIcon class="w-4 h-4" />
              </button> -->
            <button class="btn btn-square btn-sm btn-primary mr-1" @click.prevent="addGroup(matIndex)">
              <PlusIcon />
            </button>
            <button class="btn btn-square btn-sm btn-error" @click.prevent="deleteMat(matIndex)">
              <XMarkIcon />
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <draggable v-model="mat.groups" tag="div" group="groups" item-key="name">
            <template #item="{ element: group, index: groupIndex }">
              <div class="bg-base-100 p-2">
                <!-- <div v-for="(group, groupIndex) of mat" class="border p-2"> -->
                <div class="flex justify-between mb-2">
                  <h2 class="text-lg font-semibold">Group {{ groupIndex + 1 }}</h2>
                  <div class="flex">
                    <!-- <button class="btn btn-square btn-sm mr-1 btn-accent" @click.prevent="showUpdate(index)">
                      <PencilIcon class="w-4 h-4" />
                    </button> -->
                    <button class="btn btn-square btn-sm btn-primary mr-1" @click.prevent="showAdd(matIndex, groupIndex)">
                      <PlusIcon />
                    </button>
                    <button class="btn btn-square btn-sm btn-error" @click.prevent="deleteGroup(matIndex, groupIndex)">
                      <XMarkIcon />
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
                    <template #item="{ element: match }">
                      <tr class="bg-base-100">
                        <td>{{ match.tori }}</td>
                        <td>{{ match.uke }}</td>
                        <td>
                          <div>{{ getKataName(match.kata) }}</div>
                        </td>
                        <td>
                          <button class="btn btn-square btn-sm btn-error" alt="delete match">
                            <XMarkIcon class="w-4 h-4" @click.prevent="delMatch(mat.number, index)" />
                          </button>
                        </td>
                      </tr>
                    </template>
                  </draggable>
                </table>
                <!-- </div> -->
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="addingMatch ? 'modal-open' : ''">
      <div class="modal-box">
        <div class="form-control w-full">
          <label class="label" for="kata">
            <span class="label-text">Kata</span>
          </label>
          <select id="kata" class="select select-bordered" v-model="kata">
            <option v-for="kata of Object.keys(KATA_MAP)" :value="kata">{{ getKataName(kata) }}</option>
          </select>
        </div>
        <div class="form-control w-full">
          <label class="label" for="tori">
            <span class="label-text">Tori</span>
          </label>
          <input id="tori" type="text" class="input input-bordered" v-model="tori" />
        </div>
        <div class="form-control w-full ">
          <label class="label" for="uke">
            <span class="label-text">Uke</span>
          </label>
          <input id="uke" type="text" class="input input-bordered" v-model=uke />
        </div>
        <div class="modal-action">
          <button for="add-match-modal" class="btn btn-error btn-outline" @click.prevent="addingMatch = false">
            Cancel
          </button>
          <button for="add-match-modal" class="btn btn-primary" @click.prevent="addMatch">Add</button>
        </div>
      </div>
    </div>
    <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="updatingMat ? 'modal-open' : ''">
      <div class="modal-box">
        <div class="form-control w-full">
          <label class="label" for="numberOfJudges">
            <span class="label-text">Number of Judges</span>
          </label>
          <input id="numberOfJudges" type="number" class="input input-bordered" v-model.number="numberOfJudges" />
        </div>
        <div class="form-control w-full">
          <label class="label" for="startTime">
            <span class="label-text">Start Time</span>
          </label>
          <input id="startTime" type="time" class="input input-bordered" v-model="startTime" />
        </div>

        <div class="modal-action">
          <button for="update-mat-modal" class="btn btn-error btn-outline" @click.prevent="updatingMat = false">
            Cancel
          </button>
          <button for="update-mat-modal" class="btn btn-primary" @click.prevent="updateMat">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, ArrowLeftIcon, PencilIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { format } from 'date-fns';
import { KATA_MAP, getKataName, handleServerError } from '~~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const tournament = useState('tournament', () => ({}));
const addingMatch = useState('adding-match', () => false);
const mat = useState('mat', () => 0);
const group = useState('group', () => 0);
const kata = useState('kata', () => 'nnk');
const tori = useState('tori', () => '');
const uke = useState('uke', () => '');
const error = useState('error', () => '');
const updatingMat = useState('updating-mat', () => false);
const numberOfJudges = useState('numberOfJudges', () => 5);
const startTime = useState('startTime', () => format(new Date(), 'HH:mm'));

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

try {
  tournament.value = await $fetch(`/api/tournaments/${route.params.tournament}`, { headers });
} catch (err) {
  error.value = handleServerError(err);
}

async function showAdd(selectedMat, selectedGroup) {
  mat.value = selectedMat;
  group.value = selectedGroup;
  addingMatch.value = true;
}

async function showUpdate(selectedMat) {
  mat.value = selectedMat;
  numberOfJudges.value = tournament.value.mats[selectedMat].numberOfJudges;
  startTime.value = tournament.value.mats[selectedMat].startTime;
  updatingMat.value = true;
}

async function addMatch() {
  const body = { tournament: kata.value, tori: tori.value, uke: uke.value, kata: kata.value };
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/g/${group.value}/match`, { method: 'POST', body, headers });
  tournament.value = response;
  addingMatch.value = false;
  tori.value = '';
  uke.value = '';
}

async function updateMat() {
  const body = { mat: mat.value, numberOfJudges: numberOfJudges.value, startTime: startTime.value };
  tournament.value = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}`, { method: 'PATCH', body, headers });
  updatingMat.value = false;
}

async function delMatch(matNumber, matchId) {
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${matNumber}/match/${matchId}`, { method: 'DELETE', headers });
  tournament.value = response;
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

async function addGroup(mat) {
  const body = { numberOfJudges: numberOfJudges.value };
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g`, { method: 'POST', body, headers });
  tournament.value = response;
}

async function deleteGroup(mat, group) {
  console.log(`delete group: ${mat} ${group}`)
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}`, { method: 'DELETE', headers });
  tournament.value = response;
}
</script>
