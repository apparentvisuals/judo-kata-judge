<template>
  <Error :error-string="error" />
  <div class="flex flex-col fixed top-0 bottom-0 left-0 right-0">
    <div class="h-24 bg-base-100 flex flex-wrap gap-2 p-2 border-b items-center justify-between">
      <h1 class="text-3xl font-bold">{{ tournament.name }}</h1>
      <div class="flex gap-2" v-if="tournament.org === 'on'">
        <img class="h-20" src="/img/sponsors/hatashita.png" />
        <img class="h-20" src="/img/sponsors/mizuno.png" />
        <img class="h-20" src="/img/sponsors/fuji.png" />
        <img class="h-20" :src="getOrganizationImage(tournament.org)" />
      </div>
    </div>
    <div class="basis-1/2 bg-base-100 text-primary border-b p flex flex-col justify-center">
      <div v-if="current.kata" class="text-center text-8xl pb-10">{{ getKataName(current.kata) }}</div>
      <div v-else class=" text-center text-6xl">No More Matches</div>
      <div v-if="current.kata" class="flex flex-col">
        <div class="text-8xl">{{ current.tori }}</div>
        <div class="text-8xl text-right">{{ current.uke }}</div>
      </div>
    </div>
    <div class="basis-1/4 bg-base-100 border-b p-2 flex flex-col justify-center">
      <div class="text-center text-6xl pb-10">{{ getKataName(onDeck.kata) }}</div>
      <div class="flex justify-between">
        <div class="text-6xl">{{ onDeck.tori }}</div>
        <div class="text-6xl text-right">{{ onDeck.uke }}</div>
      </div>
    </div>
    <div class="basis-1/4 bg-base-100 p-2 flex flex-col justify-center">
      <div v-if="onDoubleDeck && onDoubleDeck.kata" class="text-center text-6xl pb-10">
        {{ getKataName(onDoubleDeck.kata) }}
      </div>
      <div v-else-if="onDoubleDeck" class=" text-center text-6xl">No More Matches</div>
      <div v-if="onDoubleDeck && onDoubleDeck.kata" class="flex justify-between">
        <div class="text-6xl">{{ onDoubleDeck.tori }}</div>
        <div class="text-6xl text-right">{{ onDoubleDeck.uke }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});

import { getKataName, getOrganizationImage, handleServerError } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const route = useRoute();
const inviteCode = computed(() => route.params.invite);

const error = ref('');
const currentGroup = ref(-1);
const currentMatch = ref(-1);

const matches = computed(() => {
  const matches = [];
  if (tournament.value.mats) {
    const mat = tournament.value.mats[route.params.mat];
    for (const group of mat.groups) {
      for (const match of group.matches) {
        matches.push({ kata: group.kata, tori: match.tori, uke: match.uke });
      }
    }
  }
  return matches;
});

const matchIndex = computed(() => {
  if (currentMatch.value === -1) {
    return -1;
  }
  if (tournament.value.mats) {
    const mat = tournament.value.mats[route.params.mat];
    let index = 0;
    for (let gI = 0; gI < mat.groups.length; gI++) {
      if (gI < currentGroup.value) {
        index += mat.groups[gI].matches.length;
      } else {
        break;
      }
    }
    index += currentMatch.value;
    return index;
  }
  return -1;
});

const current = computed(() => {
  if (matchIndex.value > -1) {
    return matches.value[matchIndex.value];
  }
  return {};
});
const onDeck = computed(() => {
  if (matchIndex.value > -1) {
    if (matchIndex.value + 1 < matches.value.length) {
      return matches.value[matchIndex.value + 1];
    }
  }
  return {};
});
const onDoubleDeck = computed(() => {
  if (matchIndex.value > -1) {
    if (matchIndex.value + 2 < matches.value.length) {
      return matches.value[matchIndex.value + 2];
    }
  }
  if (onDeck.value.kata) {
    return {};
  } else {
    return undefined;
  }
});

const { data: tournament, error: err } = await useFetch(`/api/invites/${inviteCode.value}`);
if (err.value) {
  error.value = handleServerError(err);
}

/**
 * @type UpdateEvents
 */
let event = new UpdateEvents(route.params.mat, inviteCode.value);
onMounted(async () => {
  event.connect((data) => {
    if (data.error) {
      error.value = handleServerError(data.error);
      event.close();
      return;
    }
    currentMatch.value = data.matchIndex;
    currentGroup.value = data.groupIndex;
  });
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});
</script>
