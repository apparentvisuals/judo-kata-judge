<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box">
      <div class="navbar-start">
        <NuxtLink to="/" class="btn btn-square btn-ghost">
          <ArrowLeftIcon class="w-6 h-6" />
        </NuxtLink>
      </div>
      <div class="navbar-center">
      </div>
      <div class="navbar-end">
        <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
      </div>
    </div>
    <table class="table w-full" v-for="kata in Object.keys(schedule)">
      <caption class="p-4 text-lg">{{ getKataName(kata) }}</caption>
      <thead>
        <tr>
          <th class="w-8"></th>
          <th>Pair</th>
          <th class="px-0 w-24 text-center">Start</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover" v-for="match in schedule[kata]">
          <td>{{ match.number + 1 }}</td>
          <td>{{ `${match.tori} / ${match.uke}` }}</td>
          <td>{{ `${match.time.toLocaleTimeString()}` }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { addMinutes, format, parse } from 'date-fns';
import { getKataName, handleServerError } from '@/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();
const tournament = useState('tournament', () => { return {}; });
const mat = useState('mat', () => { return { startTime: format(new Date(), 'HH:mm'), matches: [] } });
const matNumber = useState('matNumber', () => route.params.mat);
const error = useState('error', () => '');

const start = computed(() => parse(mat.value.startTime, 'HH:mm', new Date()));
const matches = computed(() => mat.value.matches);

watch(matNumber, (newValue) => {
  if (newValue !== 0) {
    _schedule(newValue);
  }
});

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
  matNumber.value = 1;
} catch (err) {
  error.value = handleServerError(err);
}

const schedule = computed(() => {
  const schedule = {};
  matches.value.forEach((match, index) => {
    if (!schedule[match.kata]) {
      schedule[match.kata] = [];
    }
    schedule[match.kata].push(match);
  });
  return schedule;
});

function breakDuration() {
  return 10;
}

function duration(kata) {
  switch (kata) {
    case 'nnk3':
      return 4;
    case 'nnk':
      return 7;
    case 'knk':
      return 10;
    case 'jnk':
      return 9;
    case 'kgj':
      return 8;
    case 'kink':
      return 11;
    case 'ko5':
    case 'ko6':
    case 'ko7':
      return 3;
    default:
      return 0;
  }
}

function matchTime(prevTime, kata, breakDuration) {
  const dur = breakDuration ? duration(kata) + breakDuration : duration(kata);
  return addMinutes(prevTime, dur);
}

function updateTime(start) {
  if (matches.value) {
    let prevKata = null;
    let prevTime = start;
    matches.value.forEach(match => {
      if (prevKata != null && prevKata !== match.kata) {
        match.time = matchTime(prevTime, prevKata, breakDuration());
      } else {
        match.time = matchTime(prevTime, prevKata);
      }
      prevKata = match.kata;
      prevTime = match.time;
    });
  }
}

async function _schedule() {
  mat.value = await $fetch(`/api/${matNumber.value}`, { headers: { authorization: `Bearer ${cookie.value.tCode}` } });
  updateTime(start.value);
}
</script>
