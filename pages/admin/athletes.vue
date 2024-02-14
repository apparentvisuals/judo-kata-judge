<template>
  <Error :error-string="error" />
  <AdminNav name="Athletes" />
  <Container>
    <ActionBar>
      <button class="btn btn-secondary" @click.prevent="showAdd" :disabled="inAction">
        <span>Add Athlete</span>
      </button>
    </ActionBar>
    <table class="admin-table">
      <thead>
        <tr>
          <th class="w-12">ID</th>
          <th>Name</th>
          <th>Rank</th>
          <th>Region</th>
          <th class="w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(a, index) in athletes">
          <td>{{ a.id }}</td>
          <td>{{ a.name }}</td>
          <td>{{ getRankName(a.rank) }}</td>
          <td>{{ getProvinceName(a.region) }}</td>
          <td>
            <div class="join">
              <button class="btn btn-secondary btn-square btn-sm join-item" @click.prevent="showUpdate(index)"
                :disabled="inAction">
                <PencilIcon class="w-4 h-4" />
              </button>
              <button class="btn btn-error btn-square btn-sm join-item" @click.prevent="showRemove(index)"
                :disabled="inAction">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
  <Prompt name="add_athlete_modal" @submit="add" :disabled="inAction" text="Add">
    <AthleteInputs :athlete="newAthlete" />
  </Prompt>
  <Prompt name="edit_athlete_modal" @submit="update" :disabled="inAction" text="Update">
    <AthleteInputs :athlete="toUpdate" />
  </Prompt>
  <Prompt name="delete_athlete_modal" @submit="remove" text="Yes">
    <span>Delete this athlete?</span>
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { getProvinceName, getRankName, handleServerError } from '~/src/utils';

useHead({
  title: 'Athletes - Kata Admin',
});

const DEFAULT = { name: '', region: 'on', rank: '1d' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const inAction = ref(false);
const newAthlete = ref(clone(DEFAULT));
const deleteIndex = ref(-1);
const updateIndex = ref(-1);
const toUpdate = ref(clone(DEFAULT));

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const { data: athletes, error: err } = await useFetch(`/api/athletes`, { headers });
watch(err, (newErr) => {
  error.value = handleServerError(newErr);
});

async function showAdd() {
  add_athlete_modal.showModal();
}

async function add() {
  inAction.value = true;
  try {
    const body = newAthlete.value;
    const athlete = await $fetch(`/api/athletes`, { method: 'POST', body, headers });
    athletes.value.push(athlete);
    newAthlete.value = clone(DEFAULT);
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

function showUpdate(index) {
  updateIndex.value = index;
  toUpdate.value = clone(athletes.value[index]);
  edit_athlete_modal.showModal();
}

async function update() {
  try {
    const id = toUpdate.value.id;
    const original = athletes.value[updateIndex.value];
    const body = pickBy(toUpdate.value, (value, key) => _filterUpdate(value, key, original));
    const athlete = await $fetch(`/api/athletes/${id}`, { method: 'POST', body, headers });
    Object.assign(original, athlete);
    updateIndex.value = -1;
    toUpdate.value = clone(DEFAULT);
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function showRemove(index) {
  deleteIndex.value = index;
  delete_athlete_modal.showModal();
}

async function remove() {
  if (deleteIndex.value > -1) {
    const id = athletes.value[deleteIndex.value].id;
    try {
      inAction.value = true;
      await $fetch(`/api/athletes/${id}`, { method: 'DELETE', headers });
      athletes.value.splice(deleteIndex.value, 1);
      error.value = '';
    } catch (err) {
      error.value = handleServerError(err);
    } finally {
      inAction.value = false;
    }
  }
}

function _filterUpdate(value, key, original) {
  if (key === '_etag') {
    return true;
  }
  if (["name", "rank", "region"].includes(key)) {
    if (original[key] !== value) {
      return true;
    }
  }
  return false;
}
</script>
