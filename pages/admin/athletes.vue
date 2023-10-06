<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Athletes" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="adding = true" :disabled="inAction">
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
            <th class="w-10"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="t in athletes">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ getRankName(t.rank) }}</td>
            <td>{{ getProvinceName(t.region) }}</td>
            <td>
              <button class="btn btn-error btn-square btn-sm" @click.prevent="remove(t.id)" :disabled="inAction">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </td>
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
            <option v-for="province of Object.keys(PROVINCE_MAP)" :value="province">
              {{ getProvinceName(province) }}
            </option>
          </select>
        </div>
        <div class="form-control w-full">
          <label class="label" for="mats">
            <span class="label-text">Rank</span>
          </label>
          <select id="kata" class="select select-bordered" v-model="newAthlete.rank">
            <option v-for="rank of Object.keys(RANK_MAP)" :value="rank">{{ getRankName(rank) }}</option>
          </select>
        </div>
        <div class="modal-action">
          <button for="add-t-modal" class="btn btn-sm btn-error btn-outline" @click.prevent="adding = false"
            :disabled="inAction">
            Cancel
          </button>
          <button for="add-t-modal" class="btn btn-sm btn-success" @click.prevent="add" :disabled="inAction">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { PROVINCE_MAP, RANK_MAP, getProvinceName, getRankName, handleServerError } from '~~/src/utils';

const DEFAULT = { name: '', region: 'on', rank: '1d' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const athletes = useState('athletes', () => ({}));
const newAthlete = useState('new-athlete', () => (DEFAULT));
const adding = useState('adding', () => false)
const inAction = useState('in-action', () => false);

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };
try {
  inAction.value = true;
  athletes.value = await $fetch(`/api/athletes`, { headers });
  error.value = '';
} catch (err) {
  error.value = handleServerError(err);
} finally {
  inAction.value = false;
}

async function add() {
  inAction.value = true;
  try {
    const body = newAthlete.value;
    const result = await $fetch(`/api/athletes`, { method: 'POST', body, headers });
    athletes.value.push(result);
    newAthlete.value = DEFAULT;
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
    adding.value = false;
  }
}

async function remove(id) {
  try {
    inAction.value = true;
    athletes.value = await $fetch(`/api/athletes/${id}`, { method: 'DELETE', headers });
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}
</script>
