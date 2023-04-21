<template>
  <div v-if="!mat" class="bg bg-base-200 h-full flex flex-col">
    <div class="py-2 px-4 bg-base-200 text-center w-full">
      <h1 v-if="error" class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-auto">
      <div class="btn block mb-4 p-4" @click.prevent="showAdd = true">
        <span>Create Tournament</span>
      </div>
      <div class="btn block mb-4 p-4" v-for="t in tournaments" @click.prevent="navigateTo(`/admin/t/${t.id}`)">
        <span>{{ `${t.name} (${t.id})` }}</span>
      </div>
    </div>
    <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="showAdd ? 'modal-open' : ''">
      <div class="modal-box">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="name">
            <span class="label-text">Name</span>
          </label>
          <input id="name" name="name" type="text" class="input input-bordered" v-model="name" />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label" for="mats">
            <span class="label-text">Number of Mats</span>
          </label>
          <input id="mats" name="mats" type="number" min="1" max="5" class="input input-bordered"
            v-model.number="numberOfMats" />
        </div>
        <div class="modal-action">
          <button for="add-t-modal" class="btn btn-error btn-outline" @click.prevent="showUpdateMat = false">
            Cancel
          </button>
          <button for="add-t-modal" class="btn btn-success" @click.prevent="addTournament">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleServerError } from '~~/src/utils';

const admin = useAdmin();
const error = useState('error', () => '');
const tournaments = useState('tournaments', () => { return {} });
const showAdd = useState('showAdd', () => false)
const name = useState('name', () => '');
const numberOfMats = useState('numberOfMats', () => 0);

try {
  tournaments.value = await $fetch(`/api/tournament`, { headers: { authorization: `Bearer ${admin.value}` } });
} catch (err) {
  error.value = handleServerError(err);
}

async function addTournament() {
  const body = { name: name.value, numberOfMats: numberOfMats.value };
  const headers = { authorization: `Bearer ${admin.value}` };
  const result = await $fetch(`/api/tournament`, { method: 'POST', body, headers });
  tournaments.value.push({ id: result.id, name: result.name });
  showAdd.value = false;
}
</script>
