<template>
  <div class="h-full overflow-auto">
    <ClientOnly>
      <ScheduleTable :tournament="tournament" :mat="$route.params.mat" />
    </ClientOnly>
  </div>
</template>

<script setup>
import { handleServerError } from '~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
} catch (err) {
  error.value = handleServerError(err);
}
</script>
