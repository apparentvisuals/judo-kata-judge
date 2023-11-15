<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Tournaments" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="showAdd" title="Create Tournament">
          <span>Create Tournament</span>
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="w-12">Code</th>
            <th>Name</th>
            <th class="w-16"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="t in tournaments">
            <td>{{ t.id }}</td>
            <td>
              <NuxtLink class="link" :to="`/admin/t/${t.id}`">{{ t.name }}</NuxtLink>
            </td>
            <td>
              <div class="join">
                <button class="btn btn-primary btn-square btn-sm join-item" @click.prevent="showUpdate(t)"
                  :disabled="inAction" title="Edit Tournament">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button class="btn btn-error btn-square btn-sm" @click.prevent="showRemove(t.id)" :disabled="inAction"
                  title="Delete Tournament">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Prompt name="add_t_modal" @submit="add" :disabled="inAction" text="Add">
      <TournamentInputs :tournament="newTournament" />
    </Prompt>
    <Prompt name="edit_t_modal" @submit="update" :disabled="inAction" text="Update">
      <TournamentInputs :tournament="tournamentToUpdate" />
    </Prompt>
    <Prompt name="delete_t_modal" @submit="remove" text="Yes">
      <span>Delete this tournament?</span>
    </Prompt>
  </div>
</template>

<script setup>
import { clone, pick } from 'lodash-es';
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { handleServerError } from '~/src/utils';

const DEFAULT = { name: '', showJudgeTotals: true };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const tournaments = ref({});
const inAction = ref(false);
const newTournament = ref(Object.assign(DEFAULT));
const tournamentToDelete = ref();
const tournamentToUpdate = ref(Object.assign(DEFAULT));

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

try {
  inAction.value = true;
  tournaments.value = await $fetch(`/api/tournaments`, { headers: { authorization: `Bearer ${cookie.value.adminCode}` } });
  error.value = '';
} catch (err) {
  error.value = handleServerError(err);
} finally {
  inAction.value = false;
}

function showAdd() {
  add_t_modal.showModal();
}

async function add() {
  try {
    inAction.value = true;
    const body = newTournament.value;
    const result = await $fetch(`/api/tournaments`, { method: 'POST', body, headers });
    tournaments.value.push({ id: result.id, name: result.name });
    newTournament.value = Object.assign(DEFAULT);
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false
  }
}

function showUpdate(tournament) {
  tournamentToUpdate.value = clone(tournament);
  tournamentToUpdate.value.originalTournament = tournament;
  edit_t_modal.showModal();
}

async function update() {
  try {
    const id = tournamentToUpdate.value.id;
    const body = pick(tournamentToUpdate.value, ["name", "org", "showJudgeTotals"]);
    const result = await $fetch(`/api/tournaments/${id}`, { method: 'POST', body, headers });
    const originalTournament = tournamentToUpdate.value.originalTournament;
    originalTournament.name = result.name;
    originalTournament.org = result.org;
    originalTournament.showJudgeTotals = result.showJudgeTotals;
    tournamentToUpdate.value = clone(DEFAULT);
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function showRemove(id) {
  tournamentToDelete.value = id;
  delete_t_modal.showModal();
}

async function remove() {
  if (tournamentToDelete.value) {
    const id = tournamentToDelete.value;
    try {
      inAction.value = true;
      tournaments.value = await $fetch(`/api/tournaments/${id}`, { method: 'DELETE', headers });
      error.value = '';
    } catch (err) {
      error.value = handleServerError(err);
    } finally {
      inAction.value = false;
    }
  }
}
</script>
