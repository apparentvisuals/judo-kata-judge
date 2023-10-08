<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <AdminNav name="Judges" />
    <div v-if="error" class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-4 py-4">
      <div class="pb-4">
        <button class="btn btn-outline btn-sm btn-primary" @click.prevent="showAdd" :disabled="inAction">
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
            <th class="w-10"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="t in judges">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ getLevelName(t.rank) }}</td>
            <td>{{ getProvinceName(t.region) }}</td>
            <td>
              <button class="btn btn-error btn-square btn-sm" @click.prevent="showRemove(t.id)" :disabled="inAction">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Prompt name="add_judge_modal" @submit="add" :disabled="inAction" text="Add">
      <JudgeInput :judge="newJudge" />
    </Prompt>
    <Prompt name="delete_judge_modal" @submit="remove" text="Yes">
      <span>Delete this judge?</span>
    </Prompt>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { getLevelName, getProvinceName, handleServerError } from '~~/src/utils';

const DEFAULT = { name: '', region: 'on', rank: 'n' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const judges = useState('judges', () => ({}));
const inAction = useState('in-action', () => false);
const newJudge = useState('new-judge', () => (DEFAULT));
const judgeToDelete = useState('judge-to-delete', () => undefined);

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

try {
  inAction.value = true;
  judges.value = await $fetch(`/api/judges`, { headers });
  error.value = '';
} catch (err) {
  error.value = handleServerError(err);
} finally {
  inAction.value = false;
}

function showAdd() {
  add_judge_modal.showModal();
}

async function add() {
  try {
    const body = newJudge.value;
    const result = await $fetch(`/api/judges`, { method: 'POST', body, headers });
    judges.value.push(result);
    newJudge.value = DEFAULT;
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function showRemove(id) {
  judgeToDelete.value = id;
  delete_judge_modal.showModal();
}

async function remove() {
  if (judgeToDelete.value) {
    const id = judgeToDelete.value;
    try {
      inAction.value = true;
      judges.value = await $fetch(`/api/judges/${id}`, { method: 'DELETE', headers });
      error.value = '';
    } catch (err) {
      error.value = handleServerError(err);
    } finally {
      inAction.value = false;
    }
  }
}
</script>
