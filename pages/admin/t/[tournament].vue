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
        <button class="btn btn-ghost" @click.prevent="save">
          Save
        </button>
      </div>
    </div>
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="flex flex-row flex-wrap p-1">
      <div v-for=" mat in tournament.mats" class="w-full md:w-1/2 xl:w-1/3 p-1">
        <div class="bg-base-100 p-2">
          <div class="flex justify-between mb-2">
            <h2 class="text-lg font-semibold">Mat {{ mat.number + 1 }}</h2>
            <div class="flex">
              <button class="btn btn-square btn-sm mr-2 btn-accent" @click.prevent="showUpdate(mat.number)">
                <PencilIcon class="w-4 h-4" />
              </button>
              <button class="btn btn-square btn-sm btn-primary" @click.prevent="showAdd(mat.number)">
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <table class="table table-compact w-full mb-2">
            <caption>Judge access codes</caption>
            <thead>
              <tr>
                <th class="w-10 text-center" v-for="index in 5">{{ index }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="code in mat.judgeCodes">{{ code }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table w-full">
            <caption>Competitor list</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th class="w-32">Kata</th>
                <th class="w-8"></th>
              </tr>
            </thead>
            <draggable v-model="mat.matches" tag="tbody" group="matches" item-key="tori">
              <template #item="{ element: match }">
                <tr class="bg-white">
                  <td>
                    <div>{{ match.tori }}</div>
                    <div>{{ match.uke }}</div>
                  </td>
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
const athletes = useState('athletes', () => []);
const addingMatch = useState('adding-match', () => false);
const mat = useState('mat', () => 0);
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

async function showAdd(selectedMat) {
  mat.value = selectedMat;
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
  const response = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat.value}/match`, { method: 'POST', body, headers });
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
</script>
