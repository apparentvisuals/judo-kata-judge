<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="my-0 mx-auto w-full p-6">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Technique</th>
            <th class="w-24 text-center" v-for="index in numberOfJudges">{{ index }}</th>
            <th class="w-24 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="score in scores">
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
  </div>

</template>

<script setup>
const scores = useState('scores', () => []);
const error = useState('error', () => null);
const numberOfJudges = useState('numberOfJudges', () => 5);

const mat = 1;

if (process.client) {
  const events = new EventSource(`/api/${mat}/report`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    numberOfJudges.value = data.numberOfJudges;
    if (!data.error) {
      scores.value = data.report;
      scores.value.push(data.summary);
    } else {
      error.value = data;
      events.close();
    }
  };
}

async function confirmScore() {
  await $fetch(`/api/${mat}/complete-match`, { method: 'POST' });
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
