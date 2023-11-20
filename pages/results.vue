<template>
  <ClientOnly>
    <div class="navbar bg-primary text-primary-content flex gap-2 text-xl">
      <img :src="getOrganizationImage(scores.org)" class="h-12" />
      <h1>{{ scores.name }}</h1>
    </div>
    <div class="navbar bg-primary text-primary-content">
      <div class="navbar-start">
        <div class="flex py-2 gap-2">
          <a class="btn btn-xl text-xl" v-for="(group, index) in scores.results" @click.prevent="scrollTo(index)"
            :class="index === resultIndex ? 'btn-info' : 'btn-ghost'">
            {{ getGroupName(group, index) }}
          </a>
        </div>
      </div>
      <div class="navbar-end"></div>
    </div>
    <div class="carousel w-full">
      <div class="carousel-item w-full" v-for="(group, index) in scores.results" :id="index">
        <div class="w-full">
          <ResultTable :show-sub-total="showSubTotal" :matches="group.matches" />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});
import { ref } from 'vue';
import { getOrganizationImage, getGroupName } from '~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const scores = useState('scores', () => ({}));
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
  events = new EventSource(`/api/summary?token=${cookie.value.tCode}`);
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
  }, 30000);
};

onMounted(() => {
  _subscribe();
  // For automatic cycling of results
  _queueChange();
});
</script>
