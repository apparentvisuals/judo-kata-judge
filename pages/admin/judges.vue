<template>
  <Error :error-string="error" />
  <AdminNav name="Judges" />
  <Container>
    <PrimeDataTable resizableColumns columnResizeMode="fit" scrollable scrollHeight="flex" :value="judges" data-key="id"
      v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['id', 'name']">
      <template #header>
        <div class="flex justify-between">
          <PrimeButton icon="pi pi-plus" :label="$t('buttons.addJudge')" :title="$t('buttons.addJudge')"
            @click.prevent="addVisible = true" :disabled="inAction" />
          <PrimeIconField>
            <PrimeInputIcon>
              <i class="pi pi-search" />
            </PrimeInputIcon>
            <PrimeInputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </PrimeIconField>
        </div>
      </template>
      <PrimeColumn field="id" :header="$t('labels.id')" class="w-10" />
      <PrimeColumn field="name" :header="$t('labels.name')" />
      <PrimeColumn field="region" :header="$t('labels.region')" class="w-48 hidden lg:table-cell"
        :show-filter-match-modes="false" show-clear-button>
        <template #body="{ data }">{{ getProvinceName(data.region) }}</template>
        <template #filter="{ filterModel }">
          <PrimeSelect v-model="filterModel.value" :options="objectToPairs(PROVINCE_MAP)" option-label="value"
            option-value="key" />
        </template>
      </PrimeColumn>
      <PrimeColumn v-for="key of ['nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink']" :key :field="key"
        :header="getKataName(key)" :show-filter-match-modes="false" show-clear-button>
        <template #body="{ data }">{{ getLevelName(data[key]) }}</template>
        <template #filter="{ filterModel }">
          <PrimeSelect v-model="filterModel.value" :options="objectToPairs(LEVEL_MAP)" option-label="value"
            option-value="key" />
        </template>
      </PrimeColumn>
      <PrimeColumn field="actions" frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ data }">
          <div class="flex justify-center gap-2">
            <PrimeButton icon="pi pi-pencil" severity="secondary" @click.prevent="showUpdate(data)" :disabled="inAction"
              title="edit" />
            <PrimeButton icon="pi pi-times" severity="danger" @click="remove(data)" title="delete"
              :disabled="inAction" />
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </Container>
  <PrimeConfirmPopup />
  <PrimeDialog v-model:visible="addVisible" modal header="Add Judge" class="w-full md:w-1/2 lg:w-1/3">
    <JudgeInput @submit="add" @cancel="addVisible = false" />
  </PrimeDialog>
  <PrimeDialog v-model:visible="updateVisible" modal header="Update Judge" class="w-full md:w-1/2 lg:w-1/3">
    <JudgeInput :judge="toUpdate" @submit="update" @cancel="updateVisible = false" />
  </PrimeDialog>
</template>

<script setup>
import { pickBy } from 'lodash-es';
import { FilterMatchMode } from '@primevue/core/api';

import { LEVEL_MAP, PROVINCE_MAP, getKataName, getLevelName, getProvinceName, handleServerError, objectToPairs } from '~/src/utils';

useHead({
  title: 'Judges - Kata Admin',
});

const cookie = useCookie('jkj', { default: () => ({}) });
const confirm = useConfirm();
const { t } = useI18n();

const error = ref('');
const inAction = ref(false);
const toUpdate = ref();
const addVisible = ref(false);
const updateVisible = ref(false);
const filters = ref({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  region: { value: '', matchMode: FilterMatchMode.EQUALS },
  nnk: { value: '', matchMode: FilterMatchMode.EQUALS },
  knk: { value: '', matchMode: FilterMatchMode.EQUALS },
  jnk: { value: '', matchMode: FilterMatchMode.EQUALS },
  kgj: { value: '', matchMode: FilterMatchMode.EQUALS },
  kink: { value: '', matchMode: FilterMatchMode.EQUALS },
  konk: { value: '', matchMode: FilterMatchMode.EQUALS },
  ink: { value: '', matchMode: FilterMatchMode.EQUALS },
});

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const { data: judges, error: err } = await useFetch(`/api/judges`, { headers });
if (err.value) {
  error.value = handleServerError(err);
}

async function add(data) {
  try {
    inAction.value = true;
    const body = data;
    const result = await $fetch(`/api/judges`, { method: 'POST', body, headers });
    judges.value.push(result);
    error.value = '';
    addVisible.value = false;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

function showUpdate(data) {
  toUpdate.value = data;
  updateVisible.value = true;
}

async function update(data) {
  try {
    const id = toUpdate.value.id;
    const body = pickBy(data, (value, key) => _filterUpdate(value, key, toUpdate.value));
    body._etag = toUpdate.value._etag;
    const judge = await $fetch(`/api/judges/${id}`, { method: 'POST', body, headers });
    Object.assign(toUpdate.value, judge);
    toUpdate.value = undefined;
    error.value = '';
    updateVisible.value = false;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function remove(data) {
  confirm.require({
    message: t('prompts.deleteJudge'),
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: async () => {
      try {
        const id = data.id;
        inAction.value = true;
        await $fetch(`/api/judges/${id}`, { method: 'DELETE', headers });
        judges.value = judges.value.filter((item) => item.id !== id);
        error.value = '';
      } catch (err) {
        error.value = handleServerError(err);
      } finally {
        inAction.value = false;
      }
    },
    reject: () => { },
  });
}

function _filterUpdate(value, key, original) {
  if (key === '_etag') {
    return true;
  }
  if (["name", "region", 'nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink'].includes(key)) {
    if (original[key] !== value) {
      return true;
    }
  }
  return false;
}
</script>
