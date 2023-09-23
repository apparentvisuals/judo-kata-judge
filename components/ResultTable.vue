<template>
  <table class="table w-full" v-for="kata in Object.keys(scores)">
    <caption class="bg-base-200 rounded-t pt-4">
      <h2 class="text-lg font-semibold">{{ getKataName(kata) }}</h2>
    </caption>
    <thead>
      <tr>
        <th class="w-8 text-center"></th>
        <th>Competitors</th>
        <th class="w-16 text-center">1</th>
        <th class="w-16 text-center">2</th>
        <th class="w-16 text-center">3</th>
        <th class="w-16 text-center">4</th>
        <th class="w-16 text-center">5</th>
        <th class="w-24 text-center">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="result in scores[kata]">
        <td class="text-center">{{ result.number + 1 }}</td>
        <td>{{ result.tori }} / {{ result.uke }}</td>
        <td class="text-center">{{ result.scores[0] }}</td>
        <td class="text-center">{{ result.scores[1] }}</td>
        <td class="text-center">{{ result.scores[2] }}</td>
        <td class="text-center">{{ result.scores[3] }}</td>
        <td class="text-center">{{ result.scores[4] }}</td>
        <td class="w-24 text-center">{{ result.total }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { getKataName } from '@/src/utils';

const props = defineProps(['mat']);
const cookie = useCookie('jkj', { default: () => ({}) });
const scores = useState('scores', () => ({}));

onUnmounted(() => {
  if (events) {
    events.close();
  }
});

let events;
function _subscribe(matNumber) {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${matNumber}/summary?token=${cookie.value.tCode}`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.error) {
      const result = {};
      data.forEach((match) => {
        if (!result[match.kata]) {
          result[match.kata] = [];
        }
        result[match.kata].push(match);
      });
      Object.keys(result).forEach((kata) => {
        result[kata].sort((a, b) => {
          const aTotal = a.total || 0;
          const bTotal = b.total || 0;
          return bTotal - aTotal;
        });
      });
      scores.value = result;
    } else {
      events.close();
    }
  };
}

_subscribe(props.mat);

</script>
