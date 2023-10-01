<template>
  <div class="bg-base-100 h-full overflow-y-auto">
    <ClientOnly>
      <ResultTable :tournament="tournament" :mat="route.params.mat" :show-sub-total="true" />
    </ClientOnly>
  </div>
</template>

<script setup>
import { handleServerError } from '@/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const error = useState('error', () => '');
const tournament = useState('tournament', () => ({}));

onMounted(async () => {
  try {
    tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
  } catch (err) {
    error.value = handleServerError(err);
  }
});
</script>
