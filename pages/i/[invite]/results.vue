<template>
  <div class="flex flex-wrap gap-2 p-2 border-b items-center z-50" :class="kiosk ? 'hidden' : ''">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost btn-square drawer-button print:hidden">
        <Bars3Icon class="w-6 h-6" />
      </label>
      <div tabindex="0"
        class="dropdown-content flex flex-col gap-2 items-center w-80 bg-secondary mt-3 p-2 shadow z-50">
        <img class="h-12 lg:hidden" :src="getOrganizationImage(tournament.org)" />
        <div class="text-lg text-center lg:hidden">{{ tournament.name }}</div>
        <ul class="menu">
          <li v-for="(group, index) in scores.results">
            <a href="#" :class="index === resultIndex ? 'active' : ''" @click.prevent="show(index)">
              {{ getGroupName(group, index) }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="hidden lg:flex flex-1 items-center justify-between">
      <h1 class="text-3xl font-bold">{{ tournament.name }}</h1>
      <!-- <div class="flex" v-if="tournament.org === 'on'">
        <img class="h-20 p-1" src="/img/sponsors/hatashita.png" />
        <img class="h-20 p-1" src="/img/sponsors/mizuno.png" />
        <img class="h-20" src="/img/sponsors/fuji.png" />
        <img class="h-20" :src="getOrganizationImage(tournament.org)" />
      </div> -->
    </div>
  </div>
  <PublicContainer>
    <ResultTable :name="getGroupName(group, resultIndex)" :show-sub-total="showSubTotal" :matches="group.matches" />
  </PublicContainer>
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
