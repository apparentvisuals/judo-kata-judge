<template>
  <Error :error-string="error" />
  <div class="navbar bg-primary text-primary-content flex gap-2 text-xl">
    <img :src="getOrganizationImage(tournament.org)" class="h-12" />
    <h1>{{ tournament.name }} Mat {{ parseInt(mat) + 1 }}</h1>
  </div>
  <ClientOnly>
    <ScheduleTable :tournament="tournament" :mat="mat" />
  </ClientOnly>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});
import { getOrganizationImage, handleServerError } from '~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();
const mat = computed(() => route.params.mat);

const error = ref('');
const tournament = ref({});

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
} catch (err) {
  error.value = handleServerError(err);
}
</script>
