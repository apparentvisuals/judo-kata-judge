<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Tournaments" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="adding = true">
          <span>Create Tournament</span>
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="w-12">Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="t in tournaments">
            <td>{{ t.id }}</td>
            <td><a class="link" href="#" @click.prevent="navigateTo(`/admin/t/${t.id}`)">{{ t.name }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal modal-bottom sm:modal-middle" :class="adding ? 'modal-open' : ''">
      <div class="modal-box">
        <div class="form-control w-full">
          <label class="label" for="name">
            <span class="label-text">Name</span>
          </label>
          <input id="name" name="name" type="text" class="input input-bordered" v-model="newTournament.name" />
        </div>
        <div class="form-control w-full">
          <label class="label" for="mats">
            <span class="label-text">Number of Mats</span>
          </label>
          <input id="mats" name="mats" type="number" min="1" max="5" class="input input-bordered"
            v-model.number="newTournament.numberOfMats" />
        </div>
        <div class="modal-action">
          <button for="add-t-modal" class="btn btn-sm btn-error btn-outline" @click.prevent="adding = false">
            Cancel
          </button>
          <button for="add-t-modal" class="btn btn-sm btn-success" @click.prevent="addTournament">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleServerError } from '~~/src/utils';

const DEFAULT = { name: '', numberOfMats: 1 };

const cookie = useCookie('jkj', { default: () => ({}) });

const newTournament = useState('new-tournament', () => DEFAULT);
const tournaments = useState('tournaments', () => ({}));
const error = useState('error', () => '');
const adding = useState('adding', () => false)

try {
  tournaments.value = await $fetch(`/api/tournaments`, { headers: { authorization: `Bearer ${cookie.value.adminCode}` } });
} catch (err) {
  error.value = handleServerError(err);
}

async function addTournament() {
  const body = newTournament.value;
  const headers = { authorization: `Bearer ${cookie.value.adminCode}` };
  const result = await $fetch(`/api/tournaments`, { method: 'POST', body, headers });
  tournaments.value.push({ id: result.id, name: result.name });
  newTournament.value = DEFAULT;
  adding.value = false;
}
</script>
