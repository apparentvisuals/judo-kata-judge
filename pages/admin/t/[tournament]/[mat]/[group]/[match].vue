<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start gap-2">
      <img :src="getOrganizationImage(tournament.org)" class="h-12" />
      <div class="text-xl">{{ tournament.name }}</div>
    </div>
    <div class="navbar-end">
      <div class="text-xl">{{ getKataName(match.kata) }}</div>
    </div>
  </div>
  <div class="p-2 flex justify-between">
    <div class="text-xl hidden md:block">
      <span>{{ match.tori }}</span>/<span class="text-blue-500">{{ match.uke }}</span>
    </div>
    <div v-for="index of numberOfResults">
      Judge {{ index }}: {{ match.scores[index - 1].name }}
    </div>
  </div>
  <table class="table w-full bg-base-100 print:border">
    <thead>
      <tr>
        <th>Technique</th>
        <th class="w-8 text-center" v-for="index of numberOfResults">{{ index }}</th>
        <th class="w-16 text-center">Score</th>
      </tr>
    </thead>
    <tbody class="bg-base-100">
      <tr v-for="(score, index) in match.results.report">
        <td>{{ moves[index] }}</td>
        <td class="text-center" v-for="value of score.values">{{ value }}</td>
        <td class="text-center">{{ score.total }}</td>
      </tr>
      <tr>
        <td>Total</td>
        <td class="text-center" v-for="value of match.results.summary.values">{{ value }}</td>
        <td class="text-center">{{ match.results.summary.total }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { ref } from 'vue';
import { getOrganizationImage, getKataName, moveList, handleServerError } from '~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const tournament = ref(undefined);
const match = ref(undefined);
const moves = computed(() => moveList(match.value.kata));
const numberOfResults = computed(() => match.value.numberOfJudges);

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const mat = route.params.mat;
const group = route.params.group;
const matchNumber = route.params.match;

try {
  tournament.value = await $fetch(`/api/tournaments/${route.params.tournament}`, { headers });
  match.value = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchNumber}`, { headers });
} catch (err) {
  error.value = handleServerError(err);
}

</script>
