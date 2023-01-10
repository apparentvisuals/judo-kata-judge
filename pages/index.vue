<template>
  <div v-if="!mat" class="bg bg-base-200 h-full flex flex-col">
    <div class="py-2 px-4 bg-base-200 text-center w-full">
      <h1 v-if="error" class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-auto max-w-xs max-h-96">
      <div class="btn-group">
        <button class="btn" v-for="aMat in numberOfMats" @click.prevent="mat = aMat">{{ `Mat ${aMat}` }}</button>
      </div>
    </div>
  </div>
  <div v-else class="bg bg-base-200 h-full overflow-y-auto">
    <div class="py-2 px-4 bg-base-200 text-center">
      <h1 v-if="error" class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
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
  </div>
</template>

<script setup>
import { getKataName, handleServerError } from '@/src/utils';

const auth = useAuth();
const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });
const scores = useState('scores', () => { return {}; });
const numberOfMats = computed(() => tournament.value.numberOfMats);
const mat = useState('mat', () => 0);

try {
  tournament.value = await $fetch('/api/tournament', { headers: { authorization: `Bearer ${auth.value}` } });
} catch (err) {
  error.value = handleServerError(err);
}

watch(mat, (newValue) => {
  _subscribe(newValue);
});


let events;
function _subscribe(matNumber) {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${mat.value}/summary?token=${auth.value}`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.error) {
      error.value = '';
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
      error.value = data.error;
      events.close();
    }
  };
}
</script>
