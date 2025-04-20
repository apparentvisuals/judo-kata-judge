<template>
  <PrimeToolbar v-if="!match.completed" class="print:hidden">
    <template #start>
      <div class="flex gap-2">
        <PrimeButton size="small" severity="danger" v-for="index of numberOfResults" @click.prevent="showDelete(index)">
          <span>Remove Judge {{ index }} Scores</span>
        </PrimeButton>
      </div>
    </template>
  </PrimeToolbar>
  <PrimePanel class="mt-2">
    <template #header>
      <div class="flex flex-wrap justify-between">
        <span>{{ match.tori }} / {{ match.uke }}</span>
        <span>{{ getKataName(match.kata) }}</span>
      </div>
    </template>
    <PrimeDataTable show-gridlines scrollable scroll-height="flex" :value="moves" row-group-mode="rowspan"
      group-rows-by="g">
      <PrimeColumnGroup type="header">
        <PrimeRow>
          <PrimeColumn :header="$t('labels.techniques')" :colspan="3" />
          <PrimeColumn v-for="judge of numberOfResults" :header="judge" class="w-12" />
          <PrimeColumn :header="$t('labels.scores')" />
        </PrimeRow>
      </PrimeColumnGroup>
      <PrimeColumn header="" class="w-12">
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
  </PrimePanel>
  <PrimeConfirmPopup />
</template>

<script setup>
import { calculateMoveTotal, getKataName, getScoreCounts, groupedMoveList } from '~/src/utils';

const confirm = useConfirm();
const { t } = useI18n();

const props = defineProps(['match', 'group', 'scores', 'disabled']);
const emit = defineEmits(['remove']);

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
  confirm.require({
    message: `Delete judge ${index} scores?`,
    acceptClass: '!bg-red-500 dark:!bg-red-40 !border-red-500 dark:!border-red-400 !ring-red-500 dark:!ring-red-400 hover:!bg-red-600 dark:hover:!bg-red-300 hover:!border-red-600 dark:hover:!border-red-300 focus:!ring-red-400/50 dark:!focus:ring-red-300/50',
    accept: () => {
      emit('remove', index);
    },
    reject: () => { },
  });
}

</script>
