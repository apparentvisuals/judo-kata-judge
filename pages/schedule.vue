<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box m-2">
      <div class="navbar-start">
        <button class="btn btn-square btn-ghost" @click.prevent="navigateTo('/code?from=/schedule')">
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
import { getKataName } from '@/src/utils';

const auth = useAuth();
const tournament = useState('tournament', () => { return {}; });
const mat = useState('mat', () => { return { startTime: format(new Date(), 'HH:mm'), matches: [] } });
const matNumber = useState('matNumber', () => 1);
const error = useState('error', () => '');

const numberOfMats = computed(() => tournament.value.numberOfMats);
const start = computed(() => parse(mat.value.startTime, 'HH:mm', new Date()));
const matches = computed(() => mat.value.matches);

try {
  tournament.value = await $fetch(`/api/tournament/${auth.value}`);
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

_schedule(matNumber.value);
watch(matNumber, (newValue) => {
  _schedule(newValue);
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
  mat.value = await $fetch(`/api/${matNumber.value}`, { headers: { authorization: `Bearer ${auth.value}` } });
  updateTime(start.value);
}
</script>
