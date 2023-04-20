<template>
  <div v-if="!mat" class="bg bg-base-200 h-full flex flex-col">
    <div class="py-2 px-4 bg-base-200 text-center w-full">
      <h1 v-if="error" class="text-3xl font-bold uppercase">{{ error }}</h1>
    </div>
    <div class="m-auto">
      <div class="btn block mb-4 p-4" v-for="t in tournaments" @click.prevent="navigateTo(`/admin/t/${t.id}`)">
        <span>{{ `${t.name} (${t.id})` }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleServerError } from '~~/src/utils';

const admin = useAdmin();
const error = useState('error', () => '');
const tournaments = useState('tournaments', () => { return {} });

try {
  tournaments.value = await $fetch(`/api/tournament`, { headers: { authorization: `Bearer ${admin.value}` } });
} catch (err) {
  error.value = handleServerError(err);
}
</script>
