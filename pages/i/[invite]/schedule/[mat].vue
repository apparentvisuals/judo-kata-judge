<template>
  <Error :error-string="error" />
  <UserNav :tournament="tournament" :mat="route.params.mat">
  </UserNav>
  <div class="p-2 text-xl font-bold md:hidden">
    {{ tournament.name }} Mat {{ mat }}
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
const mat = computed(() => parseInt(route.params.mat) + 1);

const error = ref('')
const tournament = ref({});

try {
  tournament.value = await $fetch(`/api/invites/${inviteCode.value}`);
} catch (err) {
  error.value = handleServerError(err);
}
</script>
