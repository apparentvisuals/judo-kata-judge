<template>
  <Error :error-string="error" />
  <UserNav :tournament="tournament" :mat="route.params.mat" />
  <PublicContainer>
    <ScheduleTable :tournament="tournament" :mat="route.params.mat" />
  </PublicContainer>
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
