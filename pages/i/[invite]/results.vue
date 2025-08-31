<template>
  <PrimeTabs scrollable v-model:value="resultIndex">
    <PrimeTabList>
      <PrimeTab v-for="(group, index) in scores.results" :key="index" :value="index">
        <a href="#" @click="show(index)">
          {{ getGroupName(group, index) }}
        </a>
      </PrimeTab>
    </PrimeTabList>
  </PrimeTabs>
  <PublicContainer>
    <ResultTable :name="getGroupName(group, resultIndex)" :show-sub-total="showSubTotal" :matches="group.matches" />
  </PublicContainer>
</template>

<script setup>
import { ref } from 'vue';
import { getOrganizationImage, getGroupName } from '~/src/utils';
import { SummaryEvents } from '~/src/event-sources';

definePageMeta({
  colorMode: 'corporate',
});

const route = useRoute();
const inviteCode = computed(() => route.params.invite);
const autoScroll = computed(() => route.query.scroll);
const kiosk = computed(() => route.query.kiosk);

const tournament = ref({});
const scores = ref({});
const resultIndex = ref(0);

const showSubTotal = computed(() => {
  if (tournament.value.showJudgeTotals != null) {
    return tournament.value.showJudgeTotals;
  }
  return true;
});
const group = computed(() => {
  if (scores.value && scores.value.results) {
    return scores.value.results[resultIndex.value];
  }
  return {};
})

const show = (index) => {
  if (index != null) {
    resultIndex.value = index;
  }
}

function _queueChange() {
  setTimeout(() => {
    if (scores.value.results && scores.value.results.length > 0) {
      const index = resultIndex.value;
      const newIndex = (index + 1) % scores.value.results.length;
      show(newIndex);
    }
    _queueChange();
  }, 20000);
};

let event = new SummaryEvents(inviteCode.value);
onMounted(async () => {
  event.connect((data) => {
    if (data.error) {
      event.close();
      return;
    }

    if (data.tournament) {
      tournament.value = data.tournament;
    }

    data.results.forEach((group) => {
      group.matches.sort((a, b) => {
        const aTotal = a.total || 0;
        const bTotal = b.total || 0;
        return bTotal - aTotal;
      });
    });
    scores.value = data;
  });
  if (autoScroll.value) {
    // For automatic cycling of results
    _queueChange();
  }
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});
</script>
