<template>
  <PrimePanel v-for="(group, groupIndex) in schedule" :key="groupIndex">
    <template #header>
      {{ group.kata }}
    </template>
    <PrimeDataTable :value="group.matches">
      <PrimeColumn field="index" class="w-8">
        <template #body="{ index }">
          {{ index + 1 }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="name" header="Tori / Uke">
        <template #body="{ data }">
          <span v-if="data.break" class="italic">Break</span>
          <span v-else>{{ data.tori }} / {{ data.uke }}</span>
        </template>
      </PrimeColumn>
      <!-- <PrimeColumn field="uke" header="Uke" /> -->
      <PrimeColumn field="startTime" header="Time" class="w-16">
        <template #body="{ data }">
          {{ data.startTime ? `${format(data.startTime, 'HH:mm')}` : '' }}
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </PrimePanel>
</template>

<script setup>
import { addMinutes, format, parse } from 'date-fns';
import { duration, getGroupName } from '~/src/utils';

const DEFAULT_BREAK = 10;
const DEFAULT_BREAK_EVERY_X_MATCH = 5;

const props = defineProps(['tournament', 'mat']);

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
        groupSchedule.matches.push(matSchedule);
        if (lastTime) {
          matSchedule.startTime = lastTime;
          lastTime = addMinutes(lastTime, duration(group.kata));
          if (matchCount % DEFAULT_BREAK_EVERY_X_MATCH === DEFAULT_BREAK_EVERY_X_MATCH - 1) {
            groupSchedule.matches.push({ break: true, startTime: lastTime });
            lastTime = addMinutes(lastTime, DEFAULT_BREAK);
          }
          matchCount += 1;
        }
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
