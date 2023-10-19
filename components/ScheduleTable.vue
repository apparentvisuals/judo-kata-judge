<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <h1 class="text-center text-xl">Mat {{ parseInt(mat) + 1 }}</h1>
    </div>
    <div class="navbar-end"></div>
  </div>
  <table class="table w-full bg-base-100 mb-2 border" v-for="(group, groupIndex) in schedule">
    <thead>
      <tr>
        <th colspan="3" class="text-center">{{ getGroupName(group, groupIndex) }}</th>
      </tr>
      <tr>
        <th class="w-8"></th>
        <th>Pair</th>
        <th class="w-10">Start</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(match, mIndex) in group.matches">
        <td>{{ mIndex + 1 }}</td>
        <td>{{ `${match.tori} / ${match.uke}` }}</td>
        <td>{{ match.startTime ? `${format(match.startTime, 'HH:mm')}` : '' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { addMinutes, format, parse } from 'date-fns';
import { duration, getGroupName } from '~/src/utils';

const DEFAULT_BREAK = 10;

const props = defineProps(['tournament', 'mat']);
// const cookie = useCookie('jkj', { default: () => ({}) });
const schedule = computed(() => {
  if (props.tournament && props.tournament.mats && props.tournament.mats.length > props.mat) {
    const mat = props.tournament.mats[props.mat];
    const schedule = [];
    let lastTime = undefined;
    for (const group of mat.groups) {
      const groupSchedule = { kata: group.kata, matches: [] };
      if (group.startTime) {
        lastTime = parse(group.startTime, 'HH:mm', new Date());
      } else {
        lastTime = addMinutes(lastTime, DEFAULT_BREAK);
      }
      for (const match of group.matches) {
        const matSchedule = { uke: match.uke, tori: match.tori };
        if (lastTime) {
          matSchedule.startTime = addMinutes(lastTime, duration(group.kata));
          lastTime = matSchedule.startTime;
        }
        groupSchedule.matches.push(matSchedule);
      }
      schedule.push(groupSchedule);
    }
    return schedule;
  }
  return [];
});

// onUnmounted(() => {
//   if (events) {
//     events.close();
//   }
// });

// let events;
// function _subscribe(matNumber) {
//   if (events) {
//     events.close();
//   }
//   events = new EventSource(`/api/${matNumber}/summary?token=${cookie.value.tCode}`);
//   events.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     if (!data.error) {
//       data.forEach((group) => {
//         group.sort((a, b) => {
//           const aTotal = a.total || 0;
//           const bTotal = b.total || 0;
//           return bTotal - aTotal;
//         });
//       });
//       scores.value = data;
//     } else {
//       events.close();
//     }
//   };
// }

// _subscribe(props.mat);

</script>

<style scoped>
@media print {
  table {
    @apply border;
  }
}
</style>
