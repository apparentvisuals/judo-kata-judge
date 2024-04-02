<template>
  <Error :error-string="error" />
  <div v-if="match" class="navbar fixed bg-primary z-50">
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
  </div>
  <Container v-if="match" class="p-2">
    <DataTable striped-rows scrollable scroll-height="flex" size="small" :value="moves" v-if="view === 'summary'">
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
      <Column v-for="judge of numberOfResults" :key="judge" :header="judge" :field="judge.toString()"
        data-type="numeric" bodyClass="w-10 text-right">
        <template #body="{ field, index }">
          {{ scores[field - 1].points[index].value }}
        </template>
      </Column>
      <Column :header="$t('labels.scores')" class="w-20 text-right">
        <template #body="{ index }">
          {{ scoreTotals[index] }}
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column :footer="$t('labels.total')" colspan="2" />
          <Column v-for="judge of numberOfResults" :footer="match.summary.scores[judge - 1]" footer-class="text-righ" />
          <Column :footer="match.summary.total" footer-class="text-right" />
        </Row>
      </ColumnGroup>
    </DataTable>
    <ScoreTable :match="match" :group="match" :scores="scores[judgeIndex - 1]" :disabled="true" v-if="view === 'judge'">
      <div class="flex flex-wrap justify-between">
        <span>{{ match.tori }} / {{ match.uke }}</span>
        <span>{{ getKataName(match.kata) }}</span>
      </div>
    </ScoreTable>
  </Container>
  <Prompt name="delete_j_modal" @submit="remove" text="Yes">
    <span>Delete judge {{ deleteIndex }} scores?</span>
  </Prompt>
</template>

<script setup>
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { calculateMoveScore, getKataName, handleServerError, getScoreCounts, calculateMoveTotal, groupedMoveList } from '~/src/utils';

const route = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const error = ref('');
const view = ref('summary');
const judgeIndex = ref(-1);
const deleteIndex = ref(-1);
const moves = computed(() => groupedMoveList(match.value.kata));
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
