<template>
  <div class="bg bg-base-200 h-full overflow-y-auto px-4">
    <div class="py-4">
      <div class="navbar bg-base-100 shadow-xl rounded-box">
        <div class="navbar-center">
          <button class="btn btn-circle">
            <ArrowLeftIcon class="w-6 h-6" @click.prevent="navigateTo('/admin')" />
          </button>
          <div class="normal-case text-xl pl-4">{{ `${tournament.name} (${tournament.id})` }}</div>
        </div>
      </div>
    </div>
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="flex flex-row gap-2">
      <div v-for="mat in tournament.mats" class="w-1/3 p-6 bg-base-100 rounded-box">
        <div>
          <div class="flex justify-between mb-2">
            <h2 class="text-lg font-semibold">Mat {{ mat.number + 1 }}</h2>
            <table class="table table-compact">
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
          </div>
          <button class="btn w-full mb-2" @click.prevent="showUpdate(mat.number)">Update</button>
          <button class="btn w-full mb-2" @click.prevent="showAdd(mat.number)">Add Match</button>
        </div>
        <table class="table w-full">
          <thead>
            <tr>
              <th class="w-4">#</th>
              <th>Name</th>
              <th class="text-right">Kata</th>
              <th class="w-6"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(match, index) in mat.matches">
              <td>{{ match.number + 1 }}</td>
              <td>
                <div>{{ match.tori }}</div>
                <div>{{ match.uke }}</div>
              </td>
              <td>
                <div class="text-right">{{ getKataName(match.kata) }}</div>
              </td>
              <td>
                <button class="btn btn-square btn-sm btn-error" alt="delete match">
                  <XMarkIcon class="w-5 h-5" @click.prevent="delMatch(mat.number, index)" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="showAddMatch ? 'modal-open' : ''">
      <div class="modal-box">
        <div class="form-control w-full">
          <label class="label" for="kata">
            <span class="label-text">Kata</span>
          </label>
          <select id="kata" class="select select-bordered" v-model="kata">
            <option value="nnk3">Nage-no-kata (3 set)</option>
            <option value="nnk">Nage-no-kata</option>
            <option value="knk">Katame-no-kata</option>
            <option value="jnk">Ju-no-kata</option>
            <option value="kgj">Kodokan-goshin-jutsu</option>
            <option value="kink">Kime-no-kata</option>
            <option value="ko5">Kodomo-no-kata 5</option>
            <option value="ko6">Kodomo-no-kata 6</option>
            <option value="ko7">Kodomo-no-kata 7</option>
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
          <button for="add-match-modal" class="btn btn-error btn-outline" @click.prevent="showAddMatch = false">
            Cancel
          </button>
          <button for="add-match-modal" class="btn btn-success" @click.prevent="addMatch">Add</button>
        </div>
      </div>
    </div>
    <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="showUpdateMat ? 'modal-open' : ''">
      <div class="modal-box">
        <div class="form-control w-full">
          <label class="label" for="numberOfJudges">
            <span class="label-text">Number of Judges</span>
          </label>
          <input id="numberOfJudges" type="number" class="input input-bordered" v-model.number="numberOfJudges" />
        </div>
        <div class="modal-action">
          <button for="update-mat-modal" class="btn btn-error btn-outline" @click.prevent="showUpdateMat = false">
            Cancel
          </button>
          <button for="update-mat-modal" class="btn btn-success" @click.prevent="updateMat">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { getKataName, handleServerError } from '~~/src/utils';

const admin = useAdmin();
const tournament = useState('tournament', () => { return {} });
const showAddMatch = useState('showAddMatch', () => false);
const mat = useState('mat', () => 0);
const kata = useState('kata', () => 'nnk');
const tori = useState('tori', () => '');
const uke = useState('uke', () => '');
const error = useState('error', () => '');
const showUpdateMat = useState('showUpdateMat', () => false);
const numberOfJudges = useState('numberOfJudges', () => 5);
const route = useRoute();

try {
  tournament.value = await $fetch(`/api/tournament/${route.params.tournament}`, { headers: { authorization: `Bearer ${admin.value}` } });
} catch (err) {
  error.value = handleServerError(err);
}

async function showAdd(selectedMat) {
  mat.value = selectedMat;
  showAddMatch.value = true;
}

async function showUpdate(selectedMat) {
  mat.value = selectedMat;
  numberOfJudges.value = tournament.value.mats[selectedMat].numberOfJudges;
  showUpdateMat.value = true;
}

async function addMatch() {
  const response = await $fetch(`/api/tournament/${route.params.tournament}/m/${mat.value}/match`, { method: 'POST', body: { kata: kata.value, tori: tori.value, uke: uke.value }, headers: { authorization: `Bearer ${admin.value}` } });
  tournament.value = response;
  showAddMatch.value = false;
  tori.value = '';
  uke.value = '';
}

async function updateMat() {
  tournament.value = await $fetch(`/api/tournament/${route.params.tournament}/m/${mat.value}`, { method: 'PATCH', body: { mat: mat.value, numberOfJudges: numberOfJudges.value }, headers: { authorization: `Bearer ${admin.value}` } });
  showUpdateMat.value = false;
}

async function delMatch(matNumber, matchId) {
  const response = await $fetch(`/api/tournament/${route.params.tournament}/m/${matNumber}/match/${matchId}`, { method: 'DELETE', headers: { authorization: `Bearer ${admin.value}` } });
  tournament.value = response;
}
</script>
