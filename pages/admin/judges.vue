<template>
  <Error :error-string="error" />
  <AdminNav name="Judges" />
  <Container>
    <ActionBar>
      <button class="btn btn-secondary" @click.prevent="showAdd" :disabled="inAction">
        <span>{{ $t('buttons.addJudge') }}</span>
      </button>
    </ActionBar>
    <table class="admin-table">
      <thead>
        <tr>
          <th class="w-12"></th>
          <th>{{ $t('labels.name') }}</th>
          <th>{{ $t('labels.rank') }}</th>
          <th>{{ $t('labels.region') }}</th>
          <th class="w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(j, index) in judges">
          <td>{{ j.id }}</td>
          <td>{{ j.name }}</td>
          <td>{{ getLevelName(j.rank) }}</td>
          <td>{{ getProvinceName(j.region) }}</td>
          <td>
            <div class="join">
              <button class="btn btn-primary btn-square btn-sm join-item" @click.prevent="showUpdate(index)"
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
  <Prompt name="add_judge_modal" @submit="add" :disabled="inAction" text="Add">
    <JudgeInput :judge="newJudge" />
  </Prompt>
  <Prompt name="edit_judge_modal" @submit="update" :disabled="inAction" text="Update">
    <JudgeInput :judge="toUpdate" />
  </Prompt>
  <Prompt name="delete_judge_modal" @submit="remove" text="Yes">
    <span>{{ $t('prompts.deleteJudge' )}}</span>
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { getLevelName, getProvinceName, handleServerError } from '~/src/utils';

useHead({
  title: 'Judges - Kata Admin',
});

const DEFAULT = { name: '', region: 'on', rank: 'n' };

const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const inAction = ref(false);
const newJudge = ref(clone(DEFAULT));
const deleteIndex = ref(-1);
const updateIndex = ref(-1);
const toUpdate = ref(clone(DEFAULT));

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const { data: judges, error: err } = await useFetch(`/api/judges`, { headers });
if (err.value) {
  error.value = handleServerError(err);
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

function showUpdate(index) {
  updateIndex.value = index;
  toUpdate.value = clone(judges.value[index]);
  edit_judge_modal.showModal();
}

async function update() {
  try {
    const id = toUpdate.value.id;
    const original = judges.value[updateIndex.value];
    const body = pickBy(toUpdate.value, (value, key) => _filterUpdate(value, key, original));
    const judge = await $fetch(`/api/judges/${id}`, { method: 'POST', body, headers });
    Object.assign(original, judge);
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
  delete_judge_modal.showModal();
}

async function remove() {
  if (deleteIndex.value > -1) {
    const id = judges.value[deleteIndex.value].id;
    try {
      inAction.value = true;
      await $fetch(`/api/judges/${id}`, { method: 'DELETE', headers });
      judges.value.splice(deleteIndex.value, 1);
      deleteIndex.value = -1;
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
