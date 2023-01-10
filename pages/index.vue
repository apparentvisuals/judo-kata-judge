<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="my-0 mx-auto w-full p-6">
      <div class="py-6">
        <label>mat: {{ mat }}</label>
      </div>
      <table class="table table-compact w-full" v-for="kata in Object.keys(summary)">
        <caption class="p-4">{{ getKataName(kata) }}</caption>
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
          <tr v-for="result in summary[kata]">
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
    </div>
  </div>
</template>

<script setup>
import { getKataName } from '@/src/utils';

const mat = 1;
const summary = useState('scores', () => []);

if (process.client) {
  const events = new EventSource(`/api/${mat}/summary`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
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
    summary.value = result;
  };
}

</script>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
}

.bg {
  background-image: radial-gradient(hsla(var(--bc)/.2) 0.5px, hsla(var(--b2)/1) 0.5px);
  background-size: 5px 5px;
}
</style>
