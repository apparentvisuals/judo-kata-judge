<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box m-2">
      <div class="navbar-start">
        <button class="btn btn-square btn-ghost" @click.prevent="navigateTo('/code?from=/')">
          <ArrowLeftIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="navbar-center">
        <div v-if="numberOfMats > 0">
          <div class="btn-group">
            <button class="btn" :class="matNumber === number ? 'btn-active' : ''" v-for="number in numberOfMats"
              @click.stop="matNumber = number">
              {{ `mat ${number}` }}
            </button>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
      </div>
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
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { getKataName, handleServerError } from '@/src/utils';

const auth = useAuth();
const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });
const scores = useState('scores', () => { return {}; });
const numberOfMats = computed(() => tournament.value.numberOfMats);
const matNumber = useState('matNumber', () => 0);

watch(matNumber, (newValue) => {
  if (newValue !== 0) {
    _subscribe(newValue);
  }
});

try {
  tournament.value = await $fetch(`/api/tournament/${auth.value}`);
  matNumber.value = 1;
} catch (err) {
  error.value = handleServerError(err);
}

let events;
function _subscribe(matNumber) {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${matNumber}/summary?token=${auth.value}`);
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
