<template>
  <div class="bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-primary shadow-xl">
      <div class="navbar-start flex gap-2 text-primary-content text-xl">
        <img :src="getOrganizationImage(tournament.org)" class="h-12" />
        <h1>{{ tournament.name }} ({{ tournament.id }})</h1>
      </div>
      <div class="navbar-end">
        <button class="btn btn-sm btn-error" @click.prevent="logout">
          <ArrowPathIcon class="w-5 h-5" />
          Change Tournament
        </button>
      </div>
    </div>
    <div class="m-4 py-4" v-if="tournament.mats">
      <div class="pb-4">
        <NuxtLink to="/results" target="_blank" class="btn btn-sm btn-primary">results</NuxtLink>
      </div>
      <table class="table" v-if="tournament.mats.length > 0">
        <thead>
          <tr>
            <th>Mat</th>
            <th class="w-6"></th>
            <th class="w-6"></th>
            <th style="width: 460px"></th>
          </tr>
        </thead>
        <tbody class="bg-base-100">
          <tr v-for="(mat, index) of tournament.mats">
            <td class="uppercase text-lg font-bold">{{ index + 1 }}</td>
            <td>
              <NuxtLink :to="`/schedule/${index}`" target="_blank" class="btn btn-sm btn-primary">schedule</NuxtLink>
            </td>
            <td>
              <NuxtLink :to="`/announce/${index}`" target="_blank" class="btn btn-sm btn-primary">announce</NuxtLink>
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink :to="`/judge/${index}/1`" target="_blank" class="btn btn-sm btn-primary">judge 1</NuxtLink>
                <NuxtLink :to="`/judge/${index}/2`" target="_blank" class="btn btn-sm btn-primary">judge 2</NuxtLink>
                <NuxtLink :to="`/judge/${index}/3`" target="_blank" class="btn btn-sm btn-primary">judge 3</NuxtLink>
                <NuxtLink :to="`/judge/${index}/4`" target="_blank" class="btn btn-sm btn-primary">judge 4</NuxtLink>
                <NuxtLink :to="`/judge/${index}/5`" target="_blank" class="btn btn-sm btn-primary">judge 5</NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { getOrganizationImage, handleServerError } from '~/src/utils';

function logout() {
  cookie.value.tCode = '';
  navigateTo('/code');
}

const cookie = useCookie('jkj', { default: () => ({}) });

const error = useState('error', () => '');
const tournament = useState('tournament', () => ({}));

try {
  tournament.value = await $fetch(`/api/tournaments/${cookie.value.tCode}`);
} catch (err) {
  cookie.value.tCode = '';
  navigateTo('/code');
  error.value = handleServerError(err);
}

</script>
