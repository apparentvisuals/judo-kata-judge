<template>
  <table class="table w-full bg-base-100">
    <thead>
      <tr>
        <th class="p-0 w-0 md:w-auto md:p-2 text-right"><span class="hidden md:inline">Technique</span></th>
        <th class="w-[50px] lg:w-12 score">S(1)</th>
        <th class="w-[50px] lg:w-12 score">S(1)</th>
        <th class="w-[50px] lg:w-12 score">M(3)</th>
        <th class="w-[50px] lg:w-12 score" v-show="!match.disableMajor">B(5)</th>
        <th class="w-[50px] lg:w-12 score" v-show="!match.disableForgotten">F(0)</th>
        <th class="w-[50px] lg:w-12 score">C</th>
        <th class="w-20 text-center">Score</th>
      </tr>
    </thead>
    <tbody class="bg-base-100">
      <template v-for="(score, index) in scores.points">
        <tr :class="techniqueColour(score)" class="md:hidden">
          <td :colspan="totalSpan + 1">{{ moves[index] }}</td>
        </tr>
        <tr :class="techniqueColour(score)">
          <td class="p-0 md:p-2 text-right"><span class="hidden md:inline">{{ moves[index] }}</span></td>
          <ScoreTableCell class="score" :binary="true" v-model="score.deductions[0]"
            @click.prevent="toggleScore(score, 0)" hint="S" />
          <ScoreTableCell class="score" :binary="true" v-model="score.deductions[1]"
            @click.prevent="toggleScore(score, 1)" hint="S" />
          <ScoreTableCell class="score" :binary="true" v-model="score.deductions[2]"
            @click.prevent="toggleScore(score, 2)" hint="M" />
          <ScoreTableCell class="score" :binary="true" :hidden="match.disableMajor" v-model="score.deductions[3]"
            @click.prevent="toggleScore(score, 3)" hint="B" />
          <ScoreTableCell class="score" :binary="true" :hidden="match.disableForgotten" v-model="score.deductions[4]"
            @click.prevent="toggleScore(score, 4)" hint="F" />
          <ScoreTableCell class="score" :binary="false" v-model="score.deductions[5]"
            @click.prevent="toggleScore(score, 5)" hint="C" />
          <td class="text-center">{{ score.value }}</td>
        </tr>
      </template>
      <tr>
        <td :colspan="totalSpan" class="md:text-right">Total</td>
        <td class="text-center">{{ total }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { calculateHasMajor, calculateMoveScore, moveList } from '~/src/utils';

const props = defineProps(['match', 'scores', 'disabled']);

const moves = computed(() => moveList(props.match.kata));
const hasMajor = computed(() => calculateHasMajor(props.scores.points));
const total = computed(() => {
  const total = props.scores.points.reduce((acc, score) => {
    if (score.value != null) {
      return acc += score.value;
    } else {
      return acc += 10;
    }
  }, 0);
  if (hasMajor.value && !props.match.disableDivideByHalf) {
    return total / 2;
  }
  return total;
});

const totalSpan = computed(() => {
  let span = 7;
  if (props.match.disableMajor) {
    span -= 1;
  }
  if (props.match.disableForgotten) {
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
