<template>
  <PrimeDataTable show-gridlines crollable scroll-height="flex" size="small" :value="moves" row-group-mode="rowspan"
    group-rows-by="g">
    <template #header>
      <div class="flex flex-wrap justify-between">
        <span>{{ match.tori }} / {{ match.uke }}</span>
        <span>{{ getKataName(match.kata) }}</span>
      </div>
      <div v-if="!match.completed" class="flex justify-between pt-2 print:hidden">
        <PrimeButton size="small" severity="danger" v-for="index of numberOfResults" @click.prevent="showDelete(index)">
          <span>Remove Judge {{ index }} Scores</span>
        </PrimeButton>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-wrap justify-between text-sm">
        <div class="flex flex-col">
          <div v-for="index of numberOfResults">
            Judge {{ index }}: {{ match.scores[index - 1].name }}
          </div>
        </div>
        <div class="flex flex-col">
          <div>Small/Petit: {{ scoreCounts.s }}</div>
          <div>Medium/Moyen: {{ scoreCounts.m }}</div>
          <div>Big/Grand: {{ scoreCounts.b }}</div>
        </div>
      </div>
    </template>
    <PrimeColumnGroup type="header">
      <PrimeRow>
        <PrimeColumn :header="$t('labels.techniques')" :colspan="3" />
        <PrimeColumn v-for="judge of numberOfResults" :header="judge" :pt="{ headercontent: 'justify-center' }"
          :pt-options="{ mergeProps: true }" />
        <PrimeColumn :header="$t('labels.scores')" :pt="{ headercontent: 'justify-end' }"
          :pt-options="{ mergeProps: true }" />
      </PrimeRow>
    </PrimeColumnGroup>
    <PrimeColumn header="" class="w-12 text-center">
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </PrimeColumn>
    <PrimeColumn field="g" class="w-8">
      <template #body="{ data }">
        <span style="writing-mode: vertical-lr;">{{ data.g }}</span>
      </template>
    </PrimeColumn>
    <PrimeColumn :header="$t('labels.techniques')">
      <template #body="{ data }">
        {{ data.t }}
      </template>
    </PrimeColumn>
    <PrimeColumn v-for="judge of numberOfResults" :key="judge" :field="judge.toString()" data-type="numeric"
      bodyClass="w-10 text-right">
      <template #body="{ field, index }">
        {{ index < scores[field - 1].points.length ? scores[field - 1].points[index].value : '' }} </template>
    </PrimeColumn>
    <PrimeColumn :header="$t('labels.scores')" class="w-20 text-right">
      <template #body="{ index }">
        <span v-if="match.completed">{{ scoreTotals[index] }}</span>
      </template>
    </PrimeColumn>
    <PrimeColumnGroup type="footer">
      <PrimeRow>
        <PrimeColumn :footer="$t('labels.total')" colspan="3" class="text-right" />
        <PrimeColumn v-for="judge of numberOfResults" :footer="match.completed ? match.summary.scores[judge - 1] : ''"
          footer-class="text-right" />
        <PrimeColumn :footer="match.completed ? match.summary.total : ''" footer-class="text-right" />
      </PrimeRow>
    </PrimeColumnGroup>
  </PrimeDataTable>
  <Prompt name="delete_j_modal" @submit="remove" text="Yes">
    <span>Delete judge {{ deleteIndex }} scores?</span>
  </Prompt>
</template>

<script setup>
import { calculateMoveTotal, getKataName, getScoreCounts, groupedMoveList } from '~/src/utils';

const props = defineProps(['match', 'group', 'scores', 'disabled']);
const emit = defineEmits(['remove']);

const deleteIndex = ref(-1);
const moves = computed(() => groupedMoveList(props.match.kata));
const numberOfResults = computed(() => props.match.numberOfJudges);

const scoreCounts = computed(() => {
  const counts = { b: 0, m: 0, s: 0 };
  if (props.match) {
    (props.match.scores || []).forEach((score) => {
      const subTotals = getScoreCounts(score.scores || []);
      counts.b += subTotals.b;
      counts.m += subTotals.m;
      counts.s += subTotals.s;
    });
  }
  return counts;
});

const scoreTotals = computed(() => {
  const totals = [];
  const judgeCount = props.scores.length;
  for (let ii = 0; ii < moves.value.length; ii++) {
    totals[ii] = calculateMoveTotal(Array(judgeCount).fill(0).map((_value, index) => {
      return props.scores[index].points[ii].value;
    }));
  }
  return totals;
});

function showDelete(index) {
  deleteIndex.value = index;
  delete_j_modal.showModal();
}

async function remove() {
  emit('remove', deleteIndex.value);
}

</script>
