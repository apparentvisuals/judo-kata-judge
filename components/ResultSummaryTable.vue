<template>
  <DataTable striped-rows scrollable scroll-height="flex" size="small" :value="moves">
    <template #header>
      <div class="flex flex-wrap justify-between">
        <span>{{ match.tori }} / {{ match.uke }}</span>
        <span>{{ getKataName(match.kata) }}</span>
      </div>
      <div v-if="!match.completed" class="flex justify-between pt-2 print:hidden">
        <Button size="small" severity="danger" v-for="index of numberOfResults" @click.prevent="showDelete(index)">
          <span>Remove Judge {{ index }} Scores</span>
        </Button>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-wrap justify-between text-sm print:hidden">
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
    <Column header="" class="w-12 text-center">
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </Column>
    <Column :header="$t('labels.techniques')">
      <template #body="{ data }">
        {{ data.t }}
      </template>
    </Column>
    <Column v-for="judge of numberOfResults" :key="judge" :header="judge" :field="judge.toString()" data-type="numeric"
      bodyClass="w-10 text-right">
      <template #body="{ field, index }">
        {{ index < scores[field - 1].points.length ? scores[field - 1].points[index].value : '' }} </template>
    </Column>
    <Column v-if="match.completed" :header="$t('labels.scores')" class="w-20 text-right">
      <template #body="{ index }">
        {{ scoreTotals[index] }}
      </template>
    </Column>
    <ColumnGroup v-if="match.completed" type="footer">
      <Row>
        <Column :footer="$t('labels.total')" colspan="2" />
        <Column v-for="judge of numberOfResults" :footer="match.summary.scores[judge - 1]" footer-class="text-right" />
        <Column :footer="match.summary.total" footer-class="text-right" />
      </Row>
    </ColumnGroup>
  </DataTable>
</template>

<script setup>
import { calculateMoveTotal, getKataName, getScoreCounts, groupedMoveList } from '~/src/utils';

const props = defineProps(['match', 'group', 'scores', 'disabled']);

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
</script>
