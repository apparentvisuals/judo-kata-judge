<template>
  <div class="navbar fixed top-0 bg-base-100 text-xl font-bold z-50">
    <div class="navbar-center gap-2 flex-1">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-square drawer-button print:hidden">
          <Bars3Icon class="w-6 h-6" />
        </label>
        <div tabindex="0" class="dropdown-content flex flex-col gap-2 items-center w-80 bg-secondary mt-3 p-2 shadow">
          <img class="h-12 md:hidden" :src="getOrganizationImage(tournament.org)" />
          <div class="text-lg text-center md:hidden">{{ tournament.name }}</div>
          <ul class="menu">
            <li v-for="(group, index) in scores.results">
              <a href="#" :class="index === resultIndex ? 'active' : ''" @click.prevent="show(index)">
                {{ getGroupName(group, index) }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <img class="h-12" :src="getOrganizationImage(tournament.org)" />
      <h1 class="hidden md:inline">{{ tournament.name }}</h1>
    </div>
  </div>
  <Container>
    <div class="text-center pb-2">
      <h2 class="text-xl font-bold">{{ getGroupName(group, resultIndex) }}</h2>
    </div>
    <ResultTable :show-sub-total="showSubTotal" :matches="group.matches" />
  </Container>
</template>

<script setup>
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { getOrganizationImage, getGroupName } from '~/src/utils';
import { SummaryEvents } from '~/src/event-sources';

definePageMeta({
  colorMode: 'corporate',
});

const route = useRoute();
const inviteCode = computed(() => route.params.invite);
const autoScroll = computed(() => route.query.scroll);

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

function show(index) {
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
