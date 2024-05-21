<template>
  <Error :error-string="error" />
  <AdminNav />
  <Container>
    <PrimeDataTable show-gridlines size="small" :value="tournaments">
      <template #header>
        <PrimeButton icon="pi pi-plus" :label="$t('buttons.createTournament')" :title="$t('buttons.createTournament')"
          @click.prevent="showAdd" :disabled="inAction" />
      </template>
      <PrimeColumn field="name" :header="$t('labels.name')">
        <template #body="{ data }">
          <NuxtLink class="link" :to="`/admin/t/${data.id}`">{{ data.name }}</NuxtLink>
        </template>
      </PrimeColumn>
      <PrimeColumn :header="$t('labels.region')" class="w-52 hidden lg:table-cell">
        <template #body="{ data }">
          {{ getOrganization(data.org) }}
        </template>
      </PrimeColumn>
      <PrimeColumn frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
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
  <PrimeConfirmPopup></PrimeConfirmPopup>
  <Prompt name="add_t_modal" @submit="add" :disabled="inAction" text="Add">
    <TournamentInputs :tournament="newTournament" :org="org" />
  </Prompt>
  <Prompt name=" edit_t_modal" @submit="update" :disabled="inAction" text="Update">
    <TournamentInputs :tournament="toUpdate" :org="org" />
  </Prompt>
</template>

<script setup>
import { clone, pickBy } from 'lodash-es';

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
const org = computed(() => cookie.value.org);

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
