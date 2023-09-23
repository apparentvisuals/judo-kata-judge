<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-base-100 shadow-xl rounded-box">
      <div class="navbar-start">
        <NuxtLink to="/" class="btn btn-square btn-ghost">
          <ArrowLeftIcon class="w-6 h-6" />
        </NuxtLink>
      </div>
      <div class="navbar-center">
      </div>
      <div class="navbar-end">
        <span v-if="error" class="text-3xl font-bold uppercase">{{ error }}</span>
      </div>
    </div>
    <ClientOnly>
      <ResultTable :mat="route.params.mat" />
    </ClientOnly>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { handleServerError } from '@/src/utils';

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
