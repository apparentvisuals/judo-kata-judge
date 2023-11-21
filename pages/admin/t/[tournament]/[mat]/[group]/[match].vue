<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start gap-2">
      <img :src="getOrganizationImage(tournament.org)" class="h-12" />
      <div class="text-xl">{{ tournament.name }}</div>
    </div>
    <div class="navbar-end">
      <div class="text-xl">{{ getKataName(matchData.kata) }}</div>
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
      <tr v-for="(score, index) in matchData.results.report">
        <td>{{ moves[index] }}</td>
        <td class="text-center" v-for="value of score.values">{{ value }}</td>
        <td class="text-center">{{ score.total }}</td>
      </tr>
      <tr>
        <td>Total</td>
        <td class="text-center" v-for="value of matchData.results.summary.values">{{ value }}</td>
        <td class="text-center">{{ matchData.results.summary.total }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { ref } from 'vue';
import { getOrganizationImage, getKataName, moveList } from '~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const tournament = ref(undefined);
const matchData = ref(undefined);
const moves = computed(() => moveList(matchData.value.kata));
const numberOfResults = computed(() => matchData.value.scores.length);

const headers = { authorization: `Bearer ${cookie.value.adminCode}` };

const mat = route.params.mat;
const group = route.params.group;
const match = route.params.match;

tournament.value = await $fetch(`/api/tournaments/${route.params.tournament}`, { headers });
matchData.value = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${match}`, { headers });
</script>
