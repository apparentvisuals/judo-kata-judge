<template>
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
            <img :src="resultsQr" alt="results link QR code" class="w-48 max-w-4xl" />
            <NuxtLink :to="resultsUrl" target="_blank" class="btn btn-sm btn-primary w-full">results</NuxtLink>
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
                <div class="join join-vertical">
                  <img :src="scheduleQrs[index].value" :alt="`mat ${index} schedule link QR code`"
                    class="w-48  max-w-4xl join-item" />
                  <NuxtLink :to="scheduleUrls[index]" target="_blank" class="btn btn-sm btn-primary join-item">
                    schedule
                  </NuxtLink>
                </div>
              </ClientOnly>
            </td>
            <td>
              <ClientOnly>
                <img :src="announceQrs[index].value" :alt="`mat ${index} schedule link QR code`"
                  class="w-48  max-w-4xl" />
                <NuxtLink :to="announceUrls[index]" target="_blank" class="btn btn-sm btn-primary w-full">announce
                </NuxtLink>
              </ClientOnly>
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink :to="`/i/${inviteCode}/judge/${index}/1`" target="_blank" class="btn btn-sm btn-primary">judge 1
                </NuxtLink>
                <NuxtLink :to="`/i/${inviteCode}/judge/${index}/2`" target="_blank" class="btn btn-sm btn-primary">judge 2
                </NuxtLink>
                <NuxtLink :to="`/i/${inviteCode}/judge/${index}/3`" target="_blank" class="btn btn-sm btn-primary">judge 3
                </NuxtLink>
                <NuxtLink :to="`/i/${inviteCode}/judge/${index}/4`" target="_blank" class="btn btn-sm btn-primary">judge 4
                </NuxtLink>
                <NuxtLink :to="`/i/${inviteCode}/judge/${index}/5`" target="_blank" class="btn btn-sm btn-primary">judge 5
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
const inviteCode = computed(() => route.params.invite);

const resultsUrl = computed(() => `/i/${inviteCode.value}/results`);
const resultsQr = useQRCode(resultsUrl);

const scheduleUrls = computed(() => {
  if (tournament.value && tournament.value.mats && tournament.value.mats.length > 0) {
    const scheduleUrls = [];
    for (let ii = 0; ii < tournament.value.mats.length; ii++) {
      scheduleUrls.push(`/i/${inviteCode.value}/schedule/${ii}`);
    }
    return scheduleUrls;
  }
  return [];
});
const scheduleQrs = computed(() => {
  return scheduleUrls.value.map((url) => useQRCode(url));
});

const announceUrls = computed(() => {
  if (tournament.value && tournament.value.mats && tournament.value.mats.length > 0) {
    const announceUrls = [];
    for (let ii = 0; ii < tournament.value.mats.length; ii++) {
      announceUrls.push(`/i/${inviteCode.value}/announce/${ii}`);
    }
    return announceUrls;
  }
  return [];
});
const announceQrs = computed(() => {
  return announceUrls.value.map((url) => useQRCode(url));
});

const error = useState('error', () => '');
const tournament = useState('tournament', () => ({}));

try {
  tournament.value = await $fetch(`/api/invites/${inviteCode.value}`);
} catch (err) {
  error.value = handleServerError(err);
}

</script>
