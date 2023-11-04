<template>
  <table class="table w-full bg-base-100 mt-2 border" v-for="(group, groupIndex) in schedule">
    <thead>
      <tr class="border-none">
        <th colspan="3" class="text-center text-lg">{{ getGroupName(group, groupIndex) }}</th>
      </tr>
      <tr class="border">
        <th class="w-8"></th>
        <th>Pair</th>
        <th class="w-10 text-right">Start</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(match, matchIndex) in group.matches">
        <!-- :class="currentMatch === matchIndex && currentGroup === groupIndex ? 'bg-warning' : ''" -->
        <td>{{ matchIndex + 1 }}</td>
        <td>{{ match.tori }} / {{ match.uke }}</td>
        <td>{{ match.startTime ? match.startTime : '' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { addMinutes, format, parse } from 'date-fns';
import { duration, getGroupName } from '~/src/utils';
import { UpdateEvents } from '~/src/event-sources';

const DEFAULT_BREAK = 10;

const props = defineProps(['tournament', 'mat']);
const cookie = useCookie('jkj', { default: () => ({}) });
const currentGroup = useState('current-group', () => -1);
const currentMatch = useState('current-match', () => -1);

const schedule = computed(() => {
  if (props.tournament && props.tournament.mats && props.tournament.mats.length > props.mat) {
    const mat = props.tournament.mats[props.mat];
    const schedule = [];
    let lastTime = undefined;
    for (const group of mat.groups) {
      const groupSchedule = { kata: group.kata, matches: [] };
      if (group.startTime) {
        lastTime = parse(group.startTime, 'HH:mm', new Date());
      } else if (lastTime) {
        lastTime = addMinutes(lastTime, DEFAULT_BREAK);
      }
      for (const match of group.matches) {
        const matSchedule = { uke: match.uke, tori: match.tori };
        if (lastTime) {
          matSchedule.startTime = lastTime;
          lastTime = addMinutes(lastTime, duration(group.kata));
        }
        groupSchedule.matches.push(matSchedule);
      }
      schedule.push(groupSchedule);
    }
    return schedule;
  }
  return [];
});

/**
 * @type UpdateEvents
 */
let event;
onMounted(async () => {
  event = new UpdateEvents(props.mat, cookie.value.tCode);
  event.connect((data) => {
    if (data.error) {
      return;
    }
    currentMatch.value = data.index;
    currentGroup.value = data.groupIndex;
  });
});

onUnmounted(() => {
  if (event) {
    event.close();
  }
});

</script>

<style scoped>
@media print {
  table {
    @apply border;
  }
}
</style>
