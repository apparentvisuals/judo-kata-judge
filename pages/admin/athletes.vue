<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Athletes" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="adding = true">
          <span>Add Athlete</span>
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="w-12">ID</th>
            <th>Name</th>
            <th>Rank</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="t in athletes">
            <td>{{ t.id }}</td>
            <td><a class="link" href="#" @click.prevent="navigateTo(`/admin/t/${t.id}`)">{{ t.name }}</a></td>
            <td>{{ t.rank }}</td>
            <td>{{ t.region }}</td>
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
          <input id="name" name="name" type="text" class="input input-bordered" v-model="newAthlete.name" />
        </div>
        <div class="form-control w-full">
          <label class="label" for="mats">
            <span class="label-text">Province</span>
          </label>
          <select id="kata" class="select select-bordered" v-model="newAthlete.region">
            <option value="on">Ontario</option>
            <option value="qc">Quebec</option>
          </select>
        </div>
        <div class="form-control w-full">
          <label class="label" for="mats">
            <span class="label-text">Rank</span>
          </label>
          <select id="kata" class="select select-bordered" v-model="newAthlete.rank">
            <option value="godan">Godan</option>
            <option value="yondan">Yondan</option>
            <option value="sandan">Sandan</option>
            <option value="nidan">Nidan</option>
            <option value="shodan">Shodan</option>
            <option value="Ikkyu">Ikkyu</option>
          </select>
        </div>
        <div class="modal-action">
          <button for="add-t-modal" class="btn btn-sm btn-error btn-outline" @click.prevent="adding = false">
            Cancel
          </button>
          <button for="add-t-modal" class="btn btn-sm btn-success" @click.prevent="addAthlete">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleServerError } from '~~/src/utils';

const DEFAULT = { name: '', region: 'on', rank: 'shodan' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const athletes = useState('athletes', () => ({}));
const newAthlete = useState('new-athlete', () => (DEFAULT));
const adding = useState('adding', () => false)

try {
  athletes.value = await $fetch(`/api/athletes`, { headers: { authorization: `Bearer ${cookie.value.adminCode}` } });
} catch (err) {
  error.value = handleServerError(err);
}

async function addAthlete() {
  const body = newAthlete.value;
  const headers = { authorization: `Bearer ${cookie.value.adminCode}` };
  const result = await $fetch(`/api/athletes`, { method: 'POST', body, headers });
  athletes.value.push(result);
  newAthlete.value = DEFAULT;
  adding.value = false;
}
</script>
