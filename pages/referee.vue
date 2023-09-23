<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box">
      <div class="navbar-start">
        <NuxtLink to="/" class="btn btn-square btn-ghost">
          <ArrowLeftIcon class="w-6 h-6" />
        </NuxtLink>
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
        <button v-else class="btn btn-primary" @click.prevent.stop="confirmScore">Submit</button>
      </div>
    </div>
    <table v-if="!error" class="table w-full">
      <caption class="bg-base-200 rounded-t px-2">
        <h2 class="text-lg font-semibold">{{ getKataName(scores.kata) }}</h2>
      </caption>
      <thead>
        <tr>
          <th>Technique</th>
          <th class="w-24 text-center" v-for="index in scores.numberOfJudges">{{ index }}</th>
          <th class="w-24 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="score in scores.report">
          <td>{{ score.technique }}</td>
          <td class="w-24 text-center" v-for="value in score.values">
            {{ value > -1 ? value : '' }}
          </td>
          <td class="w-24 text-center">
            {{ score.total }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { getKataName, handleServerError } from '~~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });
const scores = useState('scores', () => { return {}; });
const numberOfMats = computed(() => tournament.value.numberOfMats);
const matNumber = useState('matNumber', () => 1);

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
} catch (err) {
  error.value = handleServerError(err);
}

let events;
if (process.client) {
  _subscribe(matNumber.value);
}

watch(matNumber, (newValue) => {
  _subscribe(newValue);
});

async function confirmScore() {
  await $fetch(`/api/${matNumber.value}/complete-match`, { method: 'POST', headers: { authorization: `Bearer ${cookie.value.tCode}` } });
}

function _subscribe(matNumber) {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${matNumber}/report?token=${cookie.value.tCode}`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.error) {
      error.value = '';
      const value = { report: data.report };
      value.report.push(data.summary);
      value.kata = data.kata;
      value.numberOfJudges = data.numberOfJudges;
      scores.value = value;
    } else {
      error.value = data.error;
      events.close();
    }
  };
}
</script>
