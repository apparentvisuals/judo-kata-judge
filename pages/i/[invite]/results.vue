<template>
  <div class="navbar">
    <div class="navbar-start gap-2 text-xl">
      <img :src="getOrganizationImage(scores.org)" class="h-12" />
      <h1>{{ scores.name }}</h1>
    </div>
    <div class="navbar-end gap-2" v-if="tournament.org === 'on'">
      <span class="text-xl">Sponsored by:</span>
      <img src="/img/sponsors/hatashita.png" class="h-12" />
    </div>
  </div>
  <div class="navbar">
    <div class="navbar-start gap-2">
      <a class="btn btn-primary" v-for="(group, index) in scores.results" @click.prevent="scrollTo(index)"
        :class="index === resultIndex ? '' : 'btn-outline'">
        {{ getGroupName(group, index) }}
      </a>
    </div>
  </div>
  <div class="carousel w-full">
    <div class="carousel-item w-full" v-for="(group, index) in scores.results" :id="index">
      <div class="w-full p-2">
        <ResultTable :show-sub-total="showSubTotal" :matches="group.matches" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getOrganizationImage, getGroupName } from '~/src/utils';

const route = useRoute();
const inviteCode = computed(() => route.params.invite);
const autoScroll = computed(() => route.query.scroll);

const tournament = ref({});
const scores = ref({});
const resultIndex = ref(0);
const showSubTotal = computed(() => {
  if (scores.showJudgeTotals != null) {
    return scores.showJudgeTotals;
  }
  return true;
});

onUnmounted(() => {
  if (events) {
    events.close();
  }
});

let events;
function _subscribe() {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/summary?token=${tournament.value.id}`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.error) {
      data.results.forEach((group) => {
        group.matches.sort((a, b) => {
          const aTotal = a.total || 0;
          const bTotal = b.total || 0;
          return bTotal - aTotal;
        });
      });
      scores.value = data;
    } else {
      events.close();
    }
  };
}

function scrollTo(index) {
  if (index != null) {
    const element = document.getElementById(`${index}`);
    element.scrollIntoView({ behavior: 'instant' });
    resultIndex.value = index;
  }
}

function _queueChange() {
  setTimeout(() => {
    if (scores.value.results && scores.value.results.length > 0) {
      const index = resultIndex.value;
      const newIndex = (index + 1) % scores.value.results.length;
      scrollTo(newIndex);
    }
    _queueChange();
  }, 20000);
};

onMounted(async () => {
  tournament.value = await $fetch(`/api/invites/${inviteCode.value}`);
  _subscribe();
  if (autoScroll.value) {
    // For automatic cycling of results
    _queueChange();
  }
});
</script>
