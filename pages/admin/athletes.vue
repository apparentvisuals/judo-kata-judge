<template>
  <Error :error-string="error" />
  <AdminNav name="Athletes" />
  <Container class="text-surface-700 dark:text-white/80">
    <PrimeDataTable resizableColumns columnResizeMode="fit" scrollable scrollHeight="flex" :value="athletes">
      <template #header>
        <PrimeButton icon="pi pi-plus" :label="$t('buttons.addAthlete')" :title="$t('buttons.addAthlete')"
          @click.prevent="addVisible = true" :disabled="inAction" />
      </template>
      <PrimeColumn field="name" :header="$t('labels.name')">
      </PrimeColumn>
      <PrimeColumn field="rank" :header="$t('labels.rank')">
        <template #body="{ data }">{{ getRankName(data.rank) }}</template>
      </PrimeColumn>
      <PrimeColumn field="region" :header="$t('labels.region')">
        <template #body="{ data }">{{ getProvinceName(data.region) }}</template>
      </PrimeColumn>
      <PrimeColumn field="actions" frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ index }">
          <div class="flex justify-center gap-2">
            <PrimeButton icon="pi pi-pencil" severity="secondary" @click.prevent="showUpdate(index)"
              :disabled="inAction" />
            <PrimeButton icon="pi pi-times" severity="danger" @click.prevent="remove2($event, index)"
              :disabled="inAction" />
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </Container>
  <PrimeConfirmPopup />
  <PrimeDialog v-model:visible="addVisible" modal header="Add Athlete" class="w-full md:w-1/2 lg:w-1/3">
    <AthleteInputs @submit="add" @cancel="addVisible = false" />
  </PrimeDialog>
  <PrimeDialog v-model:visible="updateVisible" modal header="Update Tournament" class="w-full md:w-1/2 lg:w-1/3">
    <AthleteInputs :athlete="toUpdate" @submit="update" @cancel="updateVisible = false" />
  </PrimeDialog>
</template>

<script setup>
import { pickBy } from 'lodash-es';

import { getProvinceName, getRankName, handleServerError } from '~/src/utils';

useHead({
  title: 'Athletes - Kata Admin',
});

const cookie = useCookie('jkj', { default: () => ({}) });
const confirm = useConfirm();
const { t } = useI18n();

const error = ref('');
const inAction = ref(false);
const deleteIndex = ref(-1);
const updateIndex = ref(-1);
const toUpdate = ref();
const addVisible = ref(false);
const updateVisible = ref(false);

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const { data: athletes, error: err } = await useFetch(`/api/athletes`, { headers });
if (err.value) {
  error.value = handleServerError(err);
}

async function add(data) {
  try {
    inAction.value = true;
    const body = data;
    const athlete = await $fetch(`/api/athletes`, { method: 'POST', body, headers });
    athletes.value.push(athlete);
    error.value = '';
    addVisible.value = false;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

function showUpdate(index) {
  updateIndex.value = index;
  toUpdate.value = athletes.value[index];
  updateVisible.value = true;
}

async function update(data) {
  try {
    const id = toUpdate.value.id;
    const original = athletes.value[updateIndex.value];
    const body = pickBy(data, (value, key) => _filterUpdate(value, key, original));
    body._etag = original._etag;
    const athlete = await $fetch(`/api/athletes/${id}`, { method: 'POST', body, headers });
    Object.assign(original, athlete);
    updateIndex.value = -1;
    toUpdate.value = undefined;
    error.value = '';
    updateVisible.value = false;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function remove2(event, index) {
  confirm.require({
    target: event.currentTarget,
    message: t('prompts.deleteAthlete'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: async () => {
      await remove(index);
    },
    reject: () => { },
  });
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
