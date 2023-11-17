<template>
  <Error :error-string="error" />
  <div class="h-full overflow-auto">
    <div class="navbar">
      <div class="navbar-start gap-2 text-xl">
        <img :src="getOrganizationImage(tournament.org)" class="h-12" />
        <h1>{{ tournament.name }} Mat {{ parseInt(route.params.mat) + 1 }}</h1>
      </div>
      <div class="navbar-end gap-2" v-if="tournament.org === 'on'">
        <span class="text-xl">Sponsored by:</span>
        <img src="/img/sponsors/hatashita.png" class="h-12" />
      </div>
    </div>
    <ClientOnly>
      <ScheduleTable :tournament="tournament" :mat="route.params.mat" />
    </ClientOnly>
  </div>
</template>

<script setup>
import { getOrganizationImage, handleServerError } from '~/src/utils';

const route = useRoute();
const inviteCode = computed(() => route.params.invite);

const error = ref('')
const tournament = ref({});

try {
  tournament.value = await $fetch(`/api/invites/${inviteCode.value}`);
} catch (err) {
  error.value = handleServerError(err);
}
</script>
