<template>
  <PrimeDataTable show-gridlines scrollable scroll-height="flex" row-group-mode="rowspan" group-rows-by="g" size="small"
    :value="display" :row-class="techniqueColour">
    <template #header>
      <slot />
    </template>
    <PrimeColumnGroup type="header">
      <PrimeRow>
        <PrimeColumn :header="$t('labels.techniques')" :colspan="3" />
        <PrimeColumn header="S" :pt="{ headercontent: 'justify-center' }" :pt-options="{ mergeProps: true }" />
        <PrimeColumn header="S" :pt="{ headercontent: 'justify-center' }" :pt-options="{ mergeProps: true }" />
        <PrimeColumn v-if="!group.disableMajor" header="M" :pt="{ headercontent: 'justify-center' }"
          :pt-options="{ mergeProps: true }" />
        <PrimeColumn header="B" :pt="{ headercontent: 'justify-center' }" :pt-options="{ mergeProps: true }" />
        <PrimeColumn header="C" :pt="{ headercontent: 'justify-center' }" :pt-options="{ mergeProps: true }" />
        <PrimeColumn v-if="!group.disableForgotten" header="F" :pt="{ headercontent: 'justify-center' }"
          :pt-options="{ mergeProps: true }" />
        <PrimeColumn :header="$t('labels.scores')" :pt="{ headercontent: 'justify-end' }"
          :pt-options="{ mergeProps: true }" />
      </PrimeRow>
    </PrimeColumnGroup>
    <PrimeColumn class="w-10 text-center">
      <template #body="{ index }">{{ index + 1 }}</template>
    </PrimeColumn>
    <PrimeColumn field="g" class="w-8">
      <template #body="{ index }">
        <span style="writing-mode: vertical-lr;">{{ moves[index].g }}</span>
      </template>
    </PrimeColumn>
    <PrimeColumn field="t">
      <template #body="{ index }">
        <span>{{ moves[index].t }}</span>
      </template>
    </PrimeColumn>
    <PrimeColumn bodyClass="w-10 !p-0">
      <template #body="{ index }">
        <ScoreTableCell :binary="true" v-model="scores.points[index].deductions[0]"
          @click.prevent="toggleScore(scores.points[index], 0)" hint="S" />
      </template>
    </PrimeColumn>
    <PrimeColumn bodyClass="w-10 !p-0">
      <template #body="{ index }">
        <ScoreTableCell :binary="true" v-model="scores.points[index].deductions[1]"
          @click.prevent="toggleScore(scores.points[index], 1)" hint="S" />
      </template>
    </PrimeColumn>
    <PrimeColumn bodyClass="w-10 !p-0">
      <template #body="{ index }">
        <ScoreTableCell :binary="true" v-model="scores.points[index].deductions[2]"
          @click.prevent="toggleScore(scores.points[index], 2)" hint="M" />
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="!group.disableMajor" bodyClass="w-10 !p-0">
      <template #body="{ index }">
        <ScoreTableCell :binary="true" v-model="scores.points[index].deductions[3]"
          @click.prevent="toggleScore(scores.points[index], 3)" hint="B" />
      </template>
    </PrimeColumn>
    <PrimeColumn header="C" bodyClass="w-10 !p-0" :pt-options="{ mergeProps: true }">
      <template #body="{ index }">
        <ScoreTableCell :binary="false" v-model="scores.points[index].deductions[5]"
          @click.prevent="toggleScore(scores.points[index], 5)" hint="C" />
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="!group.disableForgotten" header="F" bodyClass="w-10 !p-0">
      <template #body="{ index }">
        <ScoreTableCell :binary="true" v-model="scores.points[index].deductions[4]"
          @click.prevent="toggleScore(scores.points[index], 4)" hint="F" />
      </template>
    </PrimeColumn>
    <PrimeColumn header="Score" class="w-16 text-right">
      <template #body="{ data }">
        {{ data.value }}
      </template>
    </PrimeColumn>
    <PrimeColumnGroup type="footer">
      <PrimeRow>
        <PrimeColumn footer="Total" :colspan="totalSpan" footer-class="text-right" />
        <PrimeColumn :footer="total" footer-class="text-right" />
      </PrimeRow>
    </PrimeColumnGroup>
  </PrimeDataTable>
</template>

<script setup>
import { calculateHasMajor, calculateMoveScore, groupedMoveList } from '~/src/utils';

const props = defineProps(['match', 'group', 'scores', 'disabled']);

const moves = computed(() => groupedMoveList(props.group.kata));
const display = computed(() => {
  if (props.scores && props.scores.points) {
    return props.scores.points.map((point, index) => {
      return { ...point, ...moves.value[index] };
    })
  }
  return [];
});

const hasMajor = computed(() => calculateHasMajor(props.scores.points));
const total = computed(() => {
  const total = props.scores.points.reduce((acc, score) => {
    if (score.value != null) {
      return acc += score.value;
    } else {
      return acc += 10;
    }
  }, 0);
  if (hasMajor.value && !props.group.disableDivideByHalf) {
    return total / 2;
  }
  return total;
});

const totalSpan = computed(() => {
  let span = 9;
  if (props.group.disableMajor) {
    span -= 1;
  }
  if (props.group.disableForgotten) {
    span -= 1;
  }
  return span;
});

function techniqueColour(score) {
  if (score) {
    if (score.deductions && score.deductions[4] === '1') {
      return 'bg-warning';
    }
    if (!score.value || score.value === 10) {
      return 'bg-yellow-50';
    }
    return '';
  }
}

async function toggleScore(score, index) {
  if (!props.disabled) {
    const deductions = score.deductions || Array(6).fill('');
    if (index === 5) {
      if (deductions[index] === '+') {
        deductions[index] = '-';
      } else if (deductions[index] === '-') {
        deductions[index] = '';
      } else {
        deductions[index] = '+';
      }
    } else {
      if (deductions[index] === '1') {
        deductions[index] = '';
      } else {
        deductions[index] = '1';
      }
    }
    score.deductions = deductions;
    score.value = calculateMoveScore(score.deductions);
  }
}
</script>

<style scoped>
.score {
  @apply px-0 text-center py-3;
}

th,
td {
  @apply border;
}

th.score {
  @apply text-center;
}

td.score {
  @apply py-3 px-3;
}
</style>
