<template>
  <Error :error-string="error" />
  <div class="bg-base-100 min-h-full">
    <div class="navbar">
      <div class="navbar-start flex gap-2 text-xl">
        <img :src="getOrganizationImage(tournament.org)" class="h-12" />
        <h1>{{ tournament.name }} ({{ tournament.id }})</h1>
      </div>
      <div class="navbar-end">
      </div>
    </div>
    <div class="m-4 py-4" v-if="tournament.mats">
      <ClientOnly>
        <div class="flex gap-48 flex-wrap">
          <QR :path="resultsPath" title="results" />
          <template v-for="(_mat, index) of tournament.mats">
            <QR :path="`/i/${invite}/schedule/${index}`" :title="`mat ${index + 1} schedule`" />
            <QR :path="`/i/${invite}/announce/${index}`" :title="`mat ${index + 1} announce`" />
          </template>
        </div>
        <div class="flex gap-48 pt-48" v-for="(_mat, index) of tournament.mats">
          <QR :path="`/i/${invite}/judge/${index}/1`" :title="`mat ${index + 1} judge 1`" />
          <QR :path="`/i/${invite}/judge/${index}/2`" :title="`mat ${index + 1} judge 2`" />
          <QR :path="`/i/${invite}/judge/${index}/3`" :title="`mat ${index + 1} judge 3`" />
          <QR :path="`/i/${invite}/judge/${index}/4`" :title="`mat ${index + 1} judge 4`" />
          <QR :path="`/i/${invite}/judge/${index}/5`" :title="`mat ${index + 1} judge 5`" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { getOrganizationImage, handleServerError } from '~/src/utils';

const route = useRoute();
const invite = computed(() => route.params.invite);
const resultsPath = computed(() => `/i/${invite.value}/results`);

const error = ref('');
const tournament = ref({});

try {
  tournament.value = await $fetch(`/api/invites/${invite.value}`);
} catch (err) {
  error.value = handleServerError(err);
}

</script>
