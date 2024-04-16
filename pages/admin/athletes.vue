<template>
  <Error :error-string="error" />
  <AdminNav name="Athletes" />
  <Container class="text-surface-700 dark:text-white/80">
    <DataTable show-gridlines size="small" sort-field="name" :sort-order="1" :value="athletes">
      <template #header>
        <ActionBar>
          <Button :label="$t('buttons.addAthlete')" :title="$t('buttons.addAthlete')" icon="pi pi-plus"
            @click.prevent="showAdd" :disabled="inAction" />
        </ActionBar>
      </template>
      <Column field="name" :header="$t('labels.name')">
      </Column>
      <Column :header="$t('labels.rank')" class="w-40 hidden md:table-cell">
        <template #body="{ data }">
          {{ getRankName(data.rank) }}
        </template>
      </Column>
      <Column :header="$t('labels.region')" class="w-48 hidden lg:table-cell">
        <template #body="{ data }">
          {{ getProvinceName(data.region) }}
        </template>
      </Column>
      <Column frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ index }">
          <div class="flex justify-center gap-1">
            <Button icon="pi pi-pencil" severity="secondary" @click.prevent="showUpdate(index)" :disabled="inAction" />
            <Button icon="pi pi-times" severity="danger" @click.prevent="showRemove(index)" :disabled="inAction" />
          </div>
        </template>
      </Column>
    </DataTable>
  </Container>
  <Prompt name="add_athlete_modal" @submit="add" :disabled="inAction" text="Add">
    <AthleteInputs :athlete="newAthlete" />
  </Prompt>
  <Prompt name="edit_athlete_modal" @submit="update" :disabled="inAction" text="Update">
    <AthleteInputs :athlete="toUpdate" />
  </Prompt>
  <Prompt name="delete_athlete_modal" @submit="remove" text="Yes">
    <span>{{ $t('prompts.deleteAthlete') }}</span>
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

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
if (err.value) {
  error.value = handleServerError(err);
}

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
