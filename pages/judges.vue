<template>
  <Container>
    <PrimeDataTable show-gridlines size="small" :value="filteredJudges">
      <template #header>
        <input v-model="search" class="input input-bordered"></input>
      </template>
      <PrimeColumn field="name" :header="$t('labels.name')"></PrimeColumn>
      <PrimeColumn :header="$t('labels.region')" class="w-48 hidden lg:table-cell">
        <template #body="{ data }">
          {{ getProvinceName(data.region) }}
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
    </PrimeDataTable>
  </Container>
</template>

<script setup>
import { getKataName, getLevelName, getProvinceName, handleServerError } from '~/src/utils';

const search = ref('');

const { data: judges, error: err } = await useFetch(`/api/public/judges`);
if (err.value) {
  error.value = handleServerError(err);
}

const filteredJudges = computed(() => {
  return judges.value.filter((a) => {
    if (search.value && search.value.length > 2) {
      if (a.name.toUpperCase().startsWith(search.value.toUpperCase())) {
        return a;
      }
    } else {
      return a;
    }
  }).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
});

</script>
