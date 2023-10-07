<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Tournaments" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="showAdd">
          <span>Create Tournament</span>
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="w-12">Code</th>
            <th>Name</th>
            <th class="w-10"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="t in tournaments">
            <td>{{ t.id }}</td>
            <td><a class="link" href="#" @click.prevent="navigateTo(`/admin/t/${t.id}`)">{{ t.name }}</a></td>
            <td>
              <button class="btn btn-error btn-square btn-sm" @click.prevent="showRemove(t.id)" :disabled="inAction">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Prompt name="add_t_modal" @submit="add" :disabled="inAction" text="Add">
      <div class="form-control w-full">
        <label class="label" for="name">
          <span class="label-text">Name</span>
        </label>
        <input id="name" name="name" type="text" class="input input-bordered" v-model="newTournament.name" required />
      </div>
      <div class="form-control w-full">
        <label class="label" for="mats">
          <span class="label-text">Number of Mats</span>
        </label>
        <input id="mats" name="mats" type="number" min="1" max="5" class="input input-bordered"
          v-model.number="newTournament.numberOfMats" />
      </div>
      <div class="form-control">
        <label class="label" for="showJudgeTotal">
          <span class="label-text">Show individual judge total on results?</span>
          <input type="checkbox" v-model="newTournament.showJudgeTotals" />
        </label>
      </div>
    </Prompt>
    <Prompt name="delete_t_modal" @submit="remove" text="Yes">
      <span>Delete this tournament?</span>
    </Prompt>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { handleServerError } from '~~/src/utils';

const DEFAULT = { name: '', numberOfMats: 1, showJudgeTotals: true };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const tournaments = useState('tournaments', () => ({}));
const inAction = useState('in-action', () => false);
const newTournament = useState('new-tournament', () => DEFAULT);
const tournamentToDelete = useState('tournament-to-delete', () => undefined);

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
    newTournament.value = DEFAULT;
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false
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
