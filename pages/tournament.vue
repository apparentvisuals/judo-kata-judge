<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="py-2 px-4 bg-base-200 text-center">
      <h1 v-if="error" class="text-3xl font-bold uppercase">{{ error }}</h1>
      <h1 v-else class="text-3xl font-bold uppercase">{{ tournament.name }}</h1>
    </div>
    <div class="flex flex-row gap-2">
      <div v-for="mat in tournament.mats" class="w-1/3">
        <table class="table table-compact w-full">
          <caption class="bg-base-200 rounded-t px-2">
            <h2 class="text-lg font-semibold">Mat {{ mat.number + 1 }}</h2>
            <button class="btn w-full" @click.prevent="showAdd(mat.number)">Add Match</button>
          </caption>
          <thead>
            <tr>
              <th class="w-4">#</th>
              <th>Name</th>
              <th class="text-right">Kata</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match in mat.matches">
              <td>{{ match.number + 1 }}</td>
              <td>
                <div>{{ match.tori }}</div>
                <div>{{ match.uke }}</div>
              </td>
              <td>
                <div class="text-right">{{ getKataName(match.kata) }}</div>
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
          <button for="add-match-modal" class="btn" @click.prevent="addMatch">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getKataName, handleServerError } from '~~/src/utils';

const auth = useAuth();
const tournament = useState('tournament', () => { return {} });
const showAddMatch = useState('showAddMatch', () => false);
const mat = useState('mat', () => 0);
const kata = useState('kata', () => 'nnk');
const tori = useState('tori', () => '');
const uke = useState('uke', () => '');
const error = useState('error', () => '');

try {
  tournament.value = await $fetch(`/api/tournament`, { headers: { authorization: `Bearer ${auth.value}` } });
} catch (err) {
  error.value = handleServerError(err);
}

async function showAdd(selectedMat) {
  mat.value = selectedMat;
  showAddMatch.value = true;
}

async function addMatch() {
  const response = await $fetch(`/api/tournament/add-match`, { method: 'POST', body: { mat: mat.value, kata: kata.value, tori: tori.value, uke: uke.value }, headers: { authorization: `Bearer ${auth.value}` } });
  tournament.value = response;
  showAddMatch.value = false;
  tori.value = '';
  uke.value = '';
}

</script>
