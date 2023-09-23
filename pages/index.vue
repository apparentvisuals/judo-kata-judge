<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-primary shadow-xl">
      <div class="navbar-start">
      </div>
      <div class="navbar-center text-primary-content">
        <h1>{{ tournament.name }}</h1>
      </div>
      <div class="navbar-end">
        <button class="btn btn-ghost text-error" @click.prevent="logout">
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
    <div class="m-4 py-4">
      <table class="table" v-if="numberOfMats > 0">
        <thead>
          <tr>
            <th>Mat</th>
            <th class="w-6"></th>
            <th class="w-6"></th>
            <th style="width: 460px"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="number in numberOfMats">
            <td class="uppercase text-lg font-bold">{{ number }}</td>
            <td>
              <NuxtLink :to="`/schedule/${number}`" class="btn btn-sm btn-primary">schedule</NuxtLink>
            </td>
            <td>
              <NuxtLink :to="`/results/${number}`" class="btn btn-sm btn-primary">results</NuxtLink>
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink :to="`/judge/${number}/1`" class="btn btn-sm btn-primary">judge 1</NuxtLink>
                <NuxtLink :to="`/judge/${number}/2`" class="btn btn-sm btn-primary">judge 2</NuxtLink>
                <NuxtLink :to="`/judge/${number}/3`" class="btn btn-sm btn-primary">judge 3</NuxtLink>
                <NuxtLink :to="`/judge/${number}/4`" class="btn btn-sm btn-primary">judge 4</NuxtLink>
                <NuxtLink :to="`/judge/${number}/5`" class="btn btn-sm btn-primary">judge 5</NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/outline';
import { handleServerError } from '@/src/utils';

function logout() {
  cookie.value.tCode = '';
  navigateTo('/code');
}

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const tournament = useState('tournament', () => { return {}; });

const numberOfMats = computed(() => tournament.value.numberOfMats);

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
} catch (err) {
  error.value = handleServerError(err);
}

</script>
