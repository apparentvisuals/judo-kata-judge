<template>
  <Error :error-string="error" />
  <AdminNav name="Judges" />
  <Container
    class="font-bold border p-4 bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-white/80">
    <DataTable show-gridlines striped-rows scrollable scroll-height="flex" size="small" :value="judges">
      <template #header>
        <ActionBar>
          <Button :label="$t('buttons.addJudge')" :title="$t('buttons.addJudge')" icon="pi pi-plus"
            @click.prevent="showAdd" :disabled="inAction" />
        </ActionBar>
      </template>
      <Column field="id" :header="$t('labels.id')" class="w-10"></Column>
      <Column field="name" :header="$t('labels.name')"></Column>
      <Column field="rank" :header="$t('labels.rank')" class="w-40">
        <template #body="{ data }">
          {{ getLevelName(data.rank) }}
        </template>
      </Column>
      <Column :header="$t('labels.region')" class="w-48">
        <template #body="{ data }">
          {{ getProvinceName(data.region) }}
        </template>
      </Column>
      <Column frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ index }">
          <div class="flex justify-center gap-1">
            <Button icon="pi pi-pencil" severity="secondary" class="w-9 h-9" @click.prevent="showUpdate(index)"
              :disabled="inAction" />
            <Button icon="pi pi-times" severity="danger" class="w-9 h-9" @click.prevent="showRemove(index)"
              :disabled="inAction" />
          </div>
        </template>
      </Column>
    </DataTable>
  </Container>
  <Prompt name="add_judge_modal" @submit="add" :disabled="inAction" text="Add">
    <JudgeInput :judge="newJudge" />
  </Prompt>
  <Prompt name="edit_judge_modal" @submit="update" :disabled="inAction" text="Update">
    <JudgeInput :judge="toUpdate" />
  </Prompt>
  <Prompt name="delete_judge_modal" @submit="remove" text="Yes">
    <span>{{ $t('prompts.deleteJudge') }}</span>
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

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
