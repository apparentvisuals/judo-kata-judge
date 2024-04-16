<template>
  <Error :error-string="error" />
  <AdminNav />
  <Container>
    <DataTable show-gridlines size="small" :value="tournaments">
      <template #header>
        <Button icon="pi pi-plus" :label="$t('buttons.createTournament')" :title="$t('buttons.createTournament')"
          @click.prevent="showAdd" :disabled="inAction" />
      </template>
      <Column field="name" :header="$t('labels.name')">
        <template #body="{ data }">
          <NuxtLink class="link" :to="`/admin/t/${data.id}`">{{ data.name }}</NuxtLink>
        </template>
      </Column>
      <Column :header="$t('labels.region')" class="w-52 hidden lg:table-cell">
        <template #body="{ data }">
          {{ getOrganization(data.org) }}
        </template>
      </Column>
      <Column frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ index }">
          <div class="flex justify-center gap-2">
            <Button icon="pi pi-pencil" severity="secondary" @click.prevent="showUpdate(index)" :disabled="inAction"
              title="Edit Tournament" />
            <Button icon="pi pi-times" severity="danger" @click.prevent="remove2($event, index)" :disabled="inAction"
              title="Delete Tournament" />
          </div>
        </template>
      </Column>
    </DataTable>
  </Container>
  <ConfirmPopup></ConfirmPopup>
  <Prompt name="add_t_modal" @submit="add" :disabled="inAction" text="Add">
    <TournamentInputs :tournament="newTournament" />
  </Prompt>
  <Prompt name="edit_t_modal" @submit="update" :disabled="inAction" text="Update">
    <TournamentInputs :tournament="toUpdate" />
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';

import { getOrganization, handleServerError } from '~/src/utils';

useHead({
  title: 'Tournaments - Kata Admin',
});

const DEFAULT = { name: '', org: 'jc', showJudgeTotals: true };

const cookie = useCookie('jkj', { default: () => ({}) });
const confirm = useConfirm();
const { t } = useI18n();

const error = ref('');
const inAction = ref(false);
const newTournament = ref(clone(DEFAULT));
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

async function remove2(event, index) {
  confirm.require({
    target: event.currentTarget,
    message: t('prompts.deleteTournament'),
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: () => {
      remove(index);
    },
    reject: () => {

    },
  })
}

async function remove(index) {
  if (index && index > -1) {
    const id = tournaments.value[index].id;
    try {
      inAction.value = true;
      await $fetch(`/api/tournaments/${id}`, { method: 'DELETE', headers });
      tournaments.value.splice(index, 1);
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
