<template>
  <Error :error-string="error" />
  <div class="bg-base-200 h-full overflow-y-auto">
    <div class="navbar bg-primary shadow-xl">
      <div class="navbar-start flex gap-2 text-primary-content text-xl">
        <img :src="getOrganizationImage(tournament.org)" class="h-12" />
        <h1>{{ tournament.name }} ({{ tournament.id }})</h1>
      </div>
      <div class="navbar-end">
      </div>
    </div>
    <div class="m-4 py-4" v-if="tournament.mats">
      <div class="flex">
        <div class="pb-4">
          <ClientOnly>
            <QR :path="resultsPath" title="results" />
          </ClientOnly>
        </div>
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
        <tbody>
          <tr v-for="(mat, index) of tournament.mats">
            <td class="uppercase text-lg font-bold">{{ index + 1 }}</td>
            <td>
              <ClientOnly>
                <QR :path="`/i/${invite}/schedule/${index}`" title="schedule" />
              </ClientOnly>
            </td>
            <td>
              <ClientOnly>
                <QR :path="`/i/${invite}/announce/${index}`" title="announce" />
              </ClientOnly>
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink :to="`/i/${invite}/judge/${index}/1`" target="_blank" class="btn btn-sm btn-primary">judge 1
                </NuxtLink>
                <NuxtLink :to="`/i/${invite}/judge/${index}/2`" target="_blank" class="btn btn-sm btn-primary">judge 2
                </NuxtLink>
                <NuxtLink :to="`/i/${invite}/judge/${index}/3`" target="_blank" class="btn btn-sm btn-primary">judge 3
                </NuxtLink>
                <NuxtLink :to="`/i/${invite}/judge/${index}/4`" target="_blank" class="btn btn-sm btn-primary">judge 4
                </NuxtLink>
                <NuxtLink :to="`/i/${invite}/judge/${index}/5`" target="_blank" class="btn btn-sm btn-primary">judge 5
                </NuxtLink>
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
