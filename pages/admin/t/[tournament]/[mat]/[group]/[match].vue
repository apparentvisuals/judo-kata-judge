<template>
  <Error :error-string="error" />
  <div v-if="match" class="navbar bg-primary">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-square drawer-button print:hidden">
          <Bars3Icon class="w-6 h-6" />
        </label>
        <div tabindex="0" class="dropdown-content mt-3 p-2  z-50 shadow-xl bg-base-200 w-40">
          <ul class="menu">
            <li><a href="#" @click.prevent="changeView('summary')">Summary</a></li>
            <li v-for="index in numberOfResults">
              <a href="#" @click.prevent="changeView('judge', index)">
                {{ 'Judge' + index }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="navbar-center">{{ match.tori }} / {{ match.uke }}</div>
    <div class="navbar-end">
      <div class="text-xl">{{ getKataName(match.kata) }}</div>
    </div>
  </div>
  <div v-if="match" class="p-2 flex justify-between print:hidden">
    <div v-for="index of numberOfResults">
      Judge {{ index }}: {{ match.scores[index - 1].name }}
    </div>
  </div>
  <div v-if="match" class="p-2">
    <div v-if="view === 'summary'">
      <div class="flex justify-between print:hidden">
        <div>Small/Petit: {{ scoreCounts.s }}</div>
        <div>Medium/Moyen: {{ scoreCounts.m }}</div>
        <div>Big/Grand: {{  scoreCounts.b }}</div>
      </div>
      <ActionBar v-if="!match.completed" class="pt-4 print:hidden">
        <button class="btn btn-error" v-for="index of numberOfResults" @click.prevent="showDelete(index)">
          <span>Remove Judge {{ index }} Scores</span>
        </button>
      </ActionBar>
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
    </div>
    <div v-if="view === 'judge'">
      <ScoreTable :match="match" :group="match" :scores="scores[judgeIndex - 1]" :disabled="true"/>
    </div>
  </div>
  <Prompt name="delete_j_modal" @submit="remove" text="Yes">
    <span>Delete judge {{ deleteIndex }} scores?</span>
  </Prompt>
</template>
<script setup>
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { calculateMoveScore, getKataName, moveList, handleServerError, getScoreCounts } from '~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const view = ref('summary');
const judgeIndex = ref(-1);
const deleteIndex = ref(-1);
const moves = computed(() => moveList(match.value.kata));
const numberOfResults = computed(() => match.value.numberOfJudges);
const headers = { authorization: `Bearer ${cookie.value.adminCode}` };
const scores = computed(() => {
  if (match.value) {
    const results = (match.value.scores || []).map(((score) => {
      return {
        points: (score.scores || []).map((score) => {
          const deductions = score.deductions.split(':');
          return { 
            deductions,
            value: calculateMoveScore(deductions),
          };
        }),
      };
    }));
    return results;
  }
  return [];
});
const scoreCounts = computed(() => {
  const counts = { b: 0, m: 0, s: 0 };
  if (match.value) {
    (match.value.scores || []).forEach((score) => {
      const subTotals = getScoreCounts(score.scores || []);
      counts.b += subTotals.b;
      counts.m += subTotals.m;
      counts.s += subTotals.s;
    });
  }
  return counts;
});

const mat = route.params.mat;
const group = route.params.group;
const matchNumber = route.params.match;

const { data: match, error: err } = await useFetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchNumber}`, { headers });
if (err) {
  error.value = handleServerError(err);
}

function changeView(newView, newJudgeIndex) {
  view.value = newView;
  if (newView === 'judge') {
    judgeIndex.value = newJudgeIndex;
  }
}

function showDelete(index) {
  deleteIndex.value = index;
  delete_j_modal.showModal();
}

async function remove() {
  match.value = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchNumber}/${deleteIndex.value}`, { method: 'DELETE', headers });
}

</script>
