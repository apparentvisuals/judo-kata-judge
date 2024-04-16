<template>
  <Error :error-string="error" />
  <NavBar :menu="true">
    <template #menu>
      <a v-for="item in navigation" href="#" @click.prevent="changeView(...item.payload)"
        :class="[item.current ? 'bg-surface-400 dark:bg-surface-700' : 'hover:bg-surface-400 dark:hover:bg-surface-700', 'text-surface-800 dark:text-white/80 block rounded-md p-2 text-sm font-medium']">
        {{ item.name }}
      </a>
    </template>
  </NavBar>
  <Container v-if="match" class="p-2">
    <ResultSummaryTable v-if="view === 'summary'" :match="match" :group="match" :scores="scores" />
    <ResultScoreTable :match="match" :group="match" :scores="scores[judgeIndex - 1]" :disabled="true"
      v-if="view === 'judge'">
      <div class="flex flex-wrap justify-between">
        <span>{{ match.tori }} / {{ match.uke }}</span>
        <span>{{ getKataName(match.kata) }}</span>
      </div>
    </ResultScoreTable>
  </Container>
  <Prompt name="delete_j_modal" @submit="remove" text="Yes">
    <span>Delete judge {{ deleteIndex }} scores?</span>
  </Prompt>
</template>

<script setup>
import { ref } from 'vue';
import { calculateMoveScore, getKataName, handleServerError, calculateMoveTotal, groupedMoveList } from '~/src/utils';

const navigation = computed(() => {
  const menu = [
    { name: 'Summary', payload: ['summary'] },
  ];
  for (let ii = 0; ii < numberOfResults.value; ii++) {
    menu.push({ name: `Judge ${ii + 1}`, payload: ['judge', ii + 1] });
  }
  return menu;
});

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });
const headers = computed(() => ({ authorization: `Bearer ${cookie.value.adminCode}` }));
const mat = route.params.mat;
const group = route.params.group;
const matchNumber = route.params.match;
const { data: match, error: err } = await useFetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchNumber}`, { headers: headers.value });

const error = ref('');
const view = ref('summary');
const judgeIndex = ref(-1);
const deleteIndex = ref(-1);
const moves = computed(() => groupedMoveList(match.value.kata));
const numberOfResults = computed(() => match.value.numberOfJudges);

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

const scoreTotals = computed(() => {
  const totals = [];
  const judgeCount = scores.value.length;
  for (let ii = 0; ii < moves.value.length; ii++) {
    totals[ii] = calculateMoveTotal(Array(judgeCount).fill(0).map((_value, index) => {
      return scores.value[index].points[ii].value;
    }));
  }
  return totals;
});

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
  match.value = await $fetch(`/api/tournaments/${route.params.tournament}/m/${mat}/g/${group}/match/${matchNumber}/${deleteIndex.value}`, { method: 'DELETE', headers: headers.value });
}

</script>
