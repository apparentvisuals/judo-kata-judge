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
      <div class="flex pb-4 flex-row gap-48 flex-wrap">
        <ClientOnly>
          <QR :path="resultsPath" title="results" />
          <QR v-for="(_mat, index) of tournament.mats" :path="`/i/${invite}/schedule/${index}`"
            :title="`schedule mat ${index + 1}`" />
          <QR v-for="(_mat, index) of tournament.mats" :path="`/i/${invite}/announce/${index}`"
            :title="`announce mat ${index + 1}`" />
          <template v-for="(_mat, index) of tournament.mats">
            <QR :path="`/i/${invite}/judge/${index}/1`" title="judge 1" />
            <QR :path="`/i/${invite}/judge/${index}/2`" title="judge 2" />
            <QR :path="`/i/${invite}/judge/${index}/3`" title="judge 3" />
            <QR :path="`/i/${invite}/judge/${index}/4`" title="judge 4" />
            <QR :path="`/i/${invite}/judge/${index}/5`" title="judge 5" />
          </template>
        </ClientOnly>
      </div>
      <table class="table print:break-after-page" v-if="tournament.mats.length > 0">
        <thead>
          <tr>
            <th>Mat</th>
            <th style="width: 460px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(_mat, index) of tournament.mats">
            <td class="uppercase text-lg font-bold">{{ index + 1 }}</td>
            <td>
              <div class="btn-group">
                <ClientOnly>
                  <QR :path="`/i/${invite}/judge/${index}/1`" title="judge 1" />
                  <QR :path="`/i/${invite}/judge/${index}/2`" title="judge 2" />
                  <QR :path="`/i/${invite}/judge/${index}/3`" title="judge 3" />
                  <QR :path="`/i/${invite}/judge/${index}/4`" title="judge 4" />
                  <QR :path="`/i/${invite}/judge/${index}/5`" title="judge 5" />
                </ClientOnly>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
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
