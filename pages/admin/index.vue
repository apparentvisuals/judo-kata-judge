<template>
  <Error :error-string="error" />
  <AdminNav name="Tournaments" />
  <Container>
    <ActionBar>
      <button class="btn btn-secondary" @click.prevent="showAdd" title="Create Tournament">
        <span>Create Tournament</span>
      </button>
    </ActionBar>
    <table class="admin-table">
      <thead>
        <tr>
          <th class="w-1/2">Name</th>
          <th class="w-1/2">Region</th>
          <th class="w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, index) in tournaments">
          <td>
            <NuxtLink class="link" :to="`/admin/t/${t.id}`">{{ t.name }}</NuxtLink>
          </td>
          <td>
            {{ getOrganization(t.org) }}
          </td>
          <td>
            <div class="join">
              <button class="btn btn-primary btn-square btn-sm join-item" @click.prevent="showUpdate(index)"
                :disabled="inAction" title="Edit Tournament">
                <PencilIcon class="w-4 h-4" />
              </button>
              <button class="btn btn-error btn-square btn-sm join-item" @click.prevent="showRemove(index)"
                :disabled="inAction" title="Delete Tournament">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
  <Prompt name="add_t_modal" @submit="add" :disabled="inAction" text="Add">
    <TournamentInputs :tournament="newTournament" />
  </Prompt>
  <Prompt name="edit_t_modal" @submit="update" :disabled="inAction" text="Update">
    <TournamentInputs :tournament="toUpdate" />
  </Prompt>
  <Prompt name="delete_t_modal" @submit="remove" text="Yes">
    <span>Delete this tournament?</span>
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { getOrganization, handleServerError } from '~/src/utils';

useHead({
  title: 'Tournaments - Kata Admin',
});

const DEFAULT = { name: '', org: 'jc', showJudgeTotals: true };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const inAction = ref(false);
const newTournament = ref(clone(DEFAULT));
const deleteIndex = ref(-1);
const updateIndex = ref(-1);
const toUpdate = ref(clone(DEFAULT));

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const { data: tournaments, error: err } = await useFetch(`/api/tournaments`, { headers });
if (err.value) {
  error.value = handleServerError(err);
}

function showAdd() {
  add_t_modal.showModal();
}

async function add() {
  try {
    inAction.value = true;
    const body = newTournament.value;
    const tournament = await $fetch(`/api/tournaments`, { method: 'POST', body, headers });
    tournaments.value.push(tournament);
    newTournament.value = clone(DEFAULT);
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false
  }
}

function showUpdate(index) {
  updateIndex.value = index;
  toUpdate.value = clone(tournaments.value[index]);
  edit_t_modal.showModal();
}

async function update() {
  try {
    const id = toUpdate.value.id;
    const original = tournaments.value[updateIndex.value];
    const body = pickBy(toUpdate.value, (value, key) => _filterUpdate(value, key, original));
    const tournament = await $fetch(`/api/tournaments/${id}`, { method: 'POST', body, headers });
    Object.assign(original, tournament);
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
  delete_t_modal.showModal();
}

async function remove() {
  if (deleteIndex.value > -1) {
    const id = tournaments.value[deleteIndex.value].id;
    try {
      inAction.value = true;
      await $fetch(`/api/tournaments/${id}`, { method: 'DELETE', headers });
      tournaments.value.splice(deleteIndex.value, 1);
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
  if (["name", "org", "showJudgeTotals"].includes(key)) {
    if (original[key] !== value) {
      return true;
    }
  }
  return false;
}
</script>
