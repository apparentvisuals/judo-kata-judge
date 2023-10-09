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
            <th class="w-16"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="j in judges">
            <td>{{ j.id }}</td>
            <td>{{ j.name }}</td>
            <td>{{ getLevelName(j.rank) }}</td>
            <td>{{ getProvinceName(j.region) }}</td>
            <td>
              <div class="join">
                <button class="btn btn-primary btn-square btn-sm join-item" @click.prevent="showUpdate(j)"
                  :disabled="inAction">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button class="btn btn-error btn-square btn-sm join-item" @click.prevent="showRemove(j.id)"
                  :disabled="inAction">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Prompt name="add_judge_modal" @submit="add" :disabled="inAction" text="Add">
      <JudgeInput :judge="newJudge" />
    </Prompt>
    <Prompt name="edit_judge_modal" @submit="update" :disabled="inAction" text="Update">
      <JudgeInput :judge="judgeToUpdate" />
    </Prompt>
    <Prompt name="delete_judge_modal" @submit="remove" text="Yes">
      <span>Delete this judge?</span>
    </Prompt>
  </div>
</template>

<script setup>
import { clone, pick } from 'lodash-es';
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { getLevelName, getProvinceName, handleServerError } from '~/src/utils';

const DEFAULT = { name: '', region: 'on', rank: 'n' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const judges = useState('judges', () => ({}));
const inAction = useState('in-action', () => false);
const newJudge = useState('new-judge', () => clone(DEFAULT));
const judgeToDelete = useState('judge-to-delete', () => undefined);
const judgeToUpdate = useState('judge-to-update', () => clone(DEFAULT));

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
    newJudge.value = clone(DEFAULT);
    error.value = '';
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

function showUpdate(judge) {
  judgeToUpdate.value = clone(judge);
  judgeToUpdate.value.originalJudge = judge;
  edit_judge_modal.showModal();
}

async function update() {
  try {
    const id = judgeToUpdate.value.id;
    const body = pick(judgeToUpdate.value, ["name", "rank", "region"]);
    const result = await $fetch(`/api/judges/${id}`, { method: 'POST', body, headers });
    const originalJudge = judgeToUpdate.value.originalJudge;
    originalJudge.name = result.name;
    originalJudge.rank = result.rank;
    originalJudge.region = result.region;
    judgeToUpdate.value = clone(DEFAULT);
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
