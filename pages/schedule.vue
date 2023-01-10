<template>
  <div class="bg bg-base-200 h-full overflow-y-auto">
    <div class="py-2 px-4 bg-base-200 text-center">
      <h1 class="text-3xl font-bold uppercase">mat {{ mat }} - Start Time <input type="time" v-model="startTime" /></h1>
    </div>
    <table class="table w-full" v-for="kata in Object.keys(schedule)">
      <caption class="p-4">{{ getKataName(kata) }}</caption>
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
import { addMinutes, format, setHours, setMinutes, setSeconds } from 'date-fns';
import { getKataName } from '@/src/utils';

const auth = useAuth();
const start = useState('start', () => setSeconds(new Date(), 0));
const matches = useState('matches', () => []);
const mat = useState('mat', () => 1);

const startTime = computed({
  get() {
    return format(start.value, 'HH:mm');
  },
  set(value) {
    const [hr, min] = value.split(':');
    console.log(hr, min);
    start.value = setHours(start.value, parseInt(hr));
    start.value = setMinutes(start.value, parseInt(min));
    start.value = setSeconds(start.value, 0);
  }
});

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

watch(start, (newValue) => {
  updateTime(newValue);
});

matches.value = await $fetch(`/api/${mat.value}`, { headers: { authorization: `Bearer ${auth.value}` } });
updateTime(start.value);

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
</script>
