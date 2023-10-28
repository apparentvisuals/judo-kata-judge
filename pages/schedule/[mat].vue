<template>
  <div class="h-full overflow-auto">
    <div class="navbar bg-primary text-primary-content flex gap-2 text-xl">
      <img :src="getOrganizationImage(tournament.org)" class="h-12" />
      <h1>{{ tournament.name }} Mat {{ parseInt(route.params.mat) + 1 }}</h1>
    </div>
    <ClientOnly>
      <ScheduleTable :tournament="tournament" :mat="route.params.mat" />
    </ClientOnly>
  </div>
</template>

<script setup>
import { getOrganizationImage, handleServerError } from '~/src/utils';

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
