<template>
  <div v-for="(group, groupIndex) in schedule" class="p-2">
    <table class="table border">
      <thead>
        <tr class="border-none">
          <th colspan="3" class="text-center text-lg">{{ group.kata }}</th>
        </tr>
        <tr class="border">
          <th class="w-8"></th>
          <th>Pair</th>
          <th class="w-10 text-right">Start</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(match, matchIndex) in group.matches">
          <td>{{ matchIndex + 1 }}</td>
          <td v-if="match.break">Break</td>
          <td v-else>{{ match.tori }} / {{ match.uke }}</td>
          <td>{{ match.startTime ? `${format(match.startTime, 'HH:mm')}` : '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { addMinutes, format, parse } from 'date-fns';
import { duration, getGroupName } from '~/src/utils';

const DEFAULT_BREAK = 10;
const DEFAULT_BREAK_EVERY_X_MATCH = 5;

const props = defineProps(['tournament', 'mat']);
// const currentGroup = useState('current-group', () => -1);
// const currentMatch = useState('current-match', () => -1);

const schedule = computed(() => {
  if (props.tournament && props.tournament.mats && props.tournament.mats.length > props.mat) {
    const mat = props.tournament.mats[props.mat];
    const schedule = [];
    let lastTime = undefined;
    for (const group of mat.groups) {
      const groupSchedule = { kata: getGroupName(group), matches: [] };
      if (group.startTime) {
        lastTime = parse(group.startTime, 'HH:mm', new Date());
      } else if (lastTime) {
        lastTime = addMinutes(lastTime, DEFAULT_BREAK);
      }
      let matchCount = 0;
      for (const match of group.matches) {
        const matSchedule = { uke: match.uke, tori: match.tori };
        if (lastTime) {
          matSchedule.startTime = lastTime;
          lastTime = addMinutes(lastTime, duration(group.kata));
        }
        groupSchedule.matches.push(matSchedule);
        if (lastTime) {
          if (matchCount % DEFAULT_BREAK_EVERY_X_MATCH === DEFAULT_BREAK_EVERY_X_MATCH - 1) {
            groupSchedule.matches.push({ break: true, startTime: lastTime });
            lastTime = addMinutes(lastTime, DEFAULT_BREAK);
          }
        }
        matchCount += 1;
      }
      schedule.push(groupSchedule);
    }
    return schedule;
  }
  return [];
});
</script>

<style scoped>
@media print {
  table {
    @apply border;
  }
}
</style>
