<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="py-2 px-4 bg-base-200 text-center">
      <div v-if="numberOfMats > 0">
        <div class="text-3xl font-bold uppercase inline-block align-middle h-12 leading-[3rem]">mat&nbsp;</div>
        <div class="btn-group">
          <button class="btn" :class="mat === matNumber ? 'btn-active' : ''" v-for="matNumber in numberOfMats"
            @click.stop="mat = matNumber">
            {{ matNumber }}
          </button>
        </div>
      </div>
      <h1 v-if="error" class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <table class="table w-full" v-if="!error">
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
    <div class="py-4">
      <button class="btn" @click.prevent.stop="confirmScore">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { getKataName, handleServerError } from '~~/src/utils';

const auth = useAuth();
const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });
const scores = useState('scores', () => { return {}; });
const numberOfMats = computed(() => tournament.value.numberOfMats);
const mat = useState('mat', () => 1);

try {
  tournament.value = await $fetch('/api/tournament', { headers: { authorization: `Bearer ${auth.value}` } });
} catch (err) {
  error.value = handleServerError(err);
}

let events;
if (process.client) {
  _subscribe(mat.value);
}

watch(mat, (newValue) => {
  _subscribe(newValue);
});

async function confirmScore() {
  await $fetch(`/api/${mat.value}/complete-match`, { method: 'POST', headers: { authorization: `Bearer ${auth.value}` } });
}

function _subscribe(matNumber) {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${matNumber}/report?token=${auth.value}`);
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
