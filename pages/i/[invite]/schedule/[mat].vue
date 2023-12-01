<template>
  <Error :error-string="error" />
  <UserNav :tournament="tournament" :mat="route.params.mat">
    <!-- <div class="navbar-end w-auto" v-if="tournament.org === 'on'">
      <img src="/img/sponsors/hatashita.png" class="h-12" />
    </div> -->
  </UserNav>
  <div class="p-2 text-xl font-bold md:hidden">
    {{ tournament.name }} Mat {{ parseInt(route.params.mat) + 1 }}
  </div>
  <ClientOnly>
    <ScheduleTable :tournament="tournament" :mat="route.params.mat" />
  </ClientOnly>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});

import { handleServerError } from '~/src/utils';

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
