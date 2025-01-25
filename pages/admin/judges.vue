<template>
  <Error :error-string="error" />
  <AdminNav name="Judges" />
  <Container>
    <PrimeDataTable show-gridlines size="small" :value="judges">
      <template #header>
        <PrimeButton icon="pi pi-plus" :label="$t('buttons.addJudge')" :title="$t('buttons.addJudge')"
          @click.prevent="showAdd" :disabled="inAction" />
      </template>
      <PrimeColumn field="id" :header="$t('labels.id')" class="w-10"></PrimeColumn>
      <PrimeColumn field="name" :header="$t('labels.name')"></PrimeColumn>
      <PrimeColumn :header="$t('labels.region')" class="w-48 hidden lg:table-cell">
        <template #body="{ data }">
          {{ getProvinceName(data.region) }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="rank" :header="$t('labels.rank')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(_getHighestLevel('', [data.nnk, data.knk, data.jnk, data.kgj, data.kink, data.konk,
          data.ink])) }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="nnk" :header="getKataName('nnk')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.nnk || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="knk" :header="getKataName('knk')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.knk || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="jnk" :header="getKataName('jnk')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.jnk || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="kgj" :header="getKataName('kgj')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.kgj || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="kink" :header="getKataName('kink')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.kink || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="konk" :header="getKataName('konk')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.konk || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="ink" :header="getKataName('ink')" class="w-32 hidden md:table-cell">
        <template #body="{ data }">
          {{ getLevelName(data.ink || '') }}
        </template>
      </PrimeColumn>
      <PrimeColumn frozen alignFrozen="right" :header="$t('labels.actions')" class="w-20">
        <template #body="{ index }">
          <div class="flex justify-center gap-2">
            <PrimeButton icon="pi pi-pencil" severity="secondary" @click.prevent="showUpdate(index)"
              :disabled="inAction" />
            <PrimeButton icon="pi pi-times" severity="danger" @click.prevent="showRemove(index)" :disabled="inAction" />
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
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

import { LEVEL_MAP, getKataName, getLevelName, getProvinceName, handleServerError } from '~/src/utils';

useHead({
  title: 'Judges - Kata Admin',
});

const DEFAULT = { name: '', region: 'on', rank: 'n' };
const RANKS = Object.keys(LEVEL_MAP);

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
  if (["name", "region", 'nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink'].includes(key)) {
    if (original[key] !== value) {
      return true;
    }
  }
  return false;
}

function _getHighestLevel(rank, individualRanks) {
  let highest = RANKS.indexOf(rank || '');
  individualRanks.forEach((rank) => {
    const individual = RANKS.indexOf(rank);
    if (individual > highest) {
      highest = individual;
    }
  });
  if (highest > 0) {
    return RANKS[highest];
  } else {
    return '';
  }
}
</script>
