<template>
  <Error :error-string="error" />
  <AdminNav />
  <Container>
    <PrimeDataTable resizableColumns columnResizeMode="fit" scrollable scrollHeight="flex" :value="tournaments">
      <template #header>
        <PrimeButton icon="pi pi-plus" :label="$t('buttons.createTournament')" :title="$t('buttons.createTournament')"
          @click.prevent="addVisible = true" :disabled="inAction" />
      </template>
      <PrimeColumn field="name" :header="$t('labels.name')">
        <template #body="{ data }">
          <NuxtLink class="link" :to="`/admin/t/${data.id}`">{{ data.name }}</NuxtLink>
        </template>
      </PrimeColumn>
      <PrimeColumn field="region" :header="$t('labels.region')">
        <template #body="{ data }">
          {{ getOrganization(data.org) }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="actions" frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ data, index }">
          <div class="flex gap-2">
            <PrimeButton icon="pi pi-check" severity="secondary" title="Complete"
              @click.prevent="toggleComplete(index)" />
            <PrimeButton icon="pi pi-box" severity="secondary" title="Archive" @click.prevent="toggleArchive(index)" />
            <PrimeButton :disabled="data.complete || inAction" icon="pi pi-pencil" @click.prevent="showUpdate(index)"
              title="Edit" />
            <PrimeButton :disabled="data.complete || inAction" icon="pi pi-times" severity="danger"
              @click.prevent="remove2($event, index)" title="Delete" />
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </Container>
  <PrimeConfirmPopup />
  <PrimeDialog v-model:visible="addVisible" modal header="Add Tournament" class="w-full md:w-1/2 lg:w-1/3">
    <TournamentInputs :org="org" @cancel="addVisible = false" @submit="add" />
  </PrimeDialog>
  <PrimeDialog v-model:visible="updateVisible" modal header="Update Tournament" class="w-full md:w-1/2 lg:w-1/3">
    <TournamentInputs :tournament="toUpdate" :org="org" @cancel="updateVisible = false" @submit="update" />
  </PrimeDialog>
</template>

<script setup>
import { pickBy } from 'lodash-es';

import { getOrganization, handleServerError } from '~/src/utils';

useHead({
  title: 'Tournaments - Kata Admin',
});

const cookie = useCookie('jkj', { default: () => ({}) });
const confirm = useConfirm();
const { t } = useI18n();

const error = ref('');
const inAction = ref(false);
const updateIndex = ref(-1);
const toUpdate = ref();
const addVisible = ref(false);
const updateVisible = ref(false);

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };
const org = computed(() => cookie.value.org);

const { data: tournaments, error: err } = await useFetch(`/api/tournaments`, { headers });
if (err.value) {
  error.value = handleServerError(err);
}

async function add(data) {
  try {
    inAction.value = true;
    const body = data;
    const tournament = await $fetch(`/api/tournaments`, { method: 'POST', body, headers });
    tournaments.value.push(tournament);
    error.value = '';
    addVisible.value = false;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false
  }
}

function showUpdate(index) {
  updateIndex.value = index;
  toUpdate.value = tournaments.value[index];
  updateVisible.value = true;
}

async function update(data) {
  try {
    const id = toUpdate.value.id;
    const original = tournaments.value[updateIndex.value];
    const body = pickBy(data, (value, key) => _filterUpdate(value, key, original));
    body._etag = original._etag;
    const tournament = await $fetch(`/api/tournaments/${id}`, { method: 'POST', body, headers });
    Object.assign(original, tournament);
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
    message: t('prompts.deleteTournament'),
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: async () => {
      await remove(index);
    },
    reject: () => { },
  });
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

async function toggleComplete(index) {
  try {
    inAction.value = true;
    const tournament = tournaments.value[index];
    const id = tournament.id;
    const complete = !!tournament.complete;
    const response = await $fetch(`/api/tournaments/${id}/${complete ? 'uncomplete' : 'complete'}`, { headers });
    tournament.complete = response.complete;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
  }
}

async function toggleArchive(index) {
  try {
    inAction.value = true;
    const tournament = tournaments.value[index];
    const id = tournament.id;
    const archive = !!tournament.archive;
    const response = await $fetch(`/api/tournaments/${id}/${archive ? 'unarchive' : 'archive'}`, { headers });
    tournament.archive = response.archive;
  } catch (err) {
    error.value = handleServerError(err);
  } finally {
    inAction.value = false;
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
