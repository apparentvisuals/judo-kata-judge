<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Judges" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="adding = true">
          <span>Add Judge</span>
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
          <tr v-for="t in judges">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ getLevelName(t.rank) }}</td>
            <td>{{ getProvinceName(t.region) }}</td>
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
          <input id="name" name="name" type="text" class="input input-bordered" v-model="newJudge.name" />
        </div>
        <div class="form-control w-full">
          <label class="label" for="province">
            <span class="label-text">Province</span>
          </label>
          <select id="province" class="select select-bordered" v-model="newJudge.region">
            <option v-for="province of Object.keys(PROVINCE_MAP)" :value="province">
              {{ getProvinceName(province) }}
            </option>
          </select>
        </div>
        <div class="form-control w-full">
          <label class="label" for="level">
            <span class="label-text">Level</span>
          </label>
          <select id="level" class="select select-bordered" v-model="newJudge.rank">
            <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
          </select>
        </div>
        <div class="modal-action">
          <button for="add-t-modal" class="btn btn-sm btn-error btn-outline" @click.prevent="adding = false">
            Cancel
          </button>
          <button for="add-t-modal" class="btn btn-sm btn-success" @click.prevent="addJudge">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LEVEL_MAP, PROVINCE_MAP, getLevelName, getProvinceName, handleServerError } from '~~/src/utils';

const DEFAULT = { name: '', region: 'on', rank: 'n' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const judges = useState('judges', () => ({}));
const newJudge = useState('new-judge', () => (DEFAULT));
const adding = useState('adding', () => false)

try {
  judges.value = await $fetch(`/api/judges`, { headers: { authorization: `Bearer ${cookie.value.adminCode}` } });
} catch (err) {
  error.value = handleServerError(err);
}

async function addJudge() {
  const body = newJudge.value;
  const headers = { authorization: `Bearer ${cookie.value.adminCode}` };
  const result = await $fetch(`/api/judges`, { method: 'POST', body, headers });
  judges.value.push(result);
  newJudge.value = DEFAULT;
  adding.value = false;
}
</script>
