<template>
  <div class="h-full overflow-auto">
    <ClientOnly>
      <div class="h-full">
        <div class="h-1/2 bg-primary text-primary-content border-b p-2 flex flex-col justify-center">
          <div class="text-center text-8xl">{{ getKataName(current.kata) }}</div>
          <div class="flex justify-between">
            <div class="text-8xl">{{ current.tori }}</div>
            <div class="text-8xl text-right">{{ current.uke }}</div>
          </div>
        </div>
        <div class="h-1/4 bg-base-100 border-b p-2 flex flex-col justify-center">
          <div class="text-center text-6xl">{{ getKataName(onDeck.kata) }}</div>
          <div class="flex justify-between">
            <div class="text-6xl">{{ onDeck.tori }}</div>
            <div class="text-6xl text-right">{{ onDeck.uke }}</div>
          </div>
        </div>
        <div class="h-1/4 bg-base-100 p-2 flex flex-col justify-center">
          <div v-if="onDoubleDeck.kata" class=" text-center text-6xl">{{ getKataName(onDoubleDeck.kata) }}</div>
          <div v-else class=" text-center text-6xl">No More Matches</div>
          <div v-if="onDoubleDeck.kata" class="flex justify-between">
            <div class="text-6xl">{{ onDoubleDeck.tori }}</div>
            <div class="text-6xl text-right">{{ onDoubleDeck.uke }}</div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { getKataName, handleServerError } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const error = useState('error', () => '');
const tournament = useState('tournament', () => ({}));
const currentGroup = useState('current-group', () => -1);
const currentMatch = useState('current-match', () => -1);

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

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
} catch (err) {
  error.value = handleServerError(err);
}

/**
 * @type UpdateEvents
 */
let event;
onMounted(async () => {
  event = new UpdateEvents(route.params.mat, cookie.value.tCode);
  event.connect((data) => {
    if (data.error) {
      return;
    }
    currentMatch.value = data.index;
    currentGroup.value = data.groupIndex;
  });
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});
</script>
