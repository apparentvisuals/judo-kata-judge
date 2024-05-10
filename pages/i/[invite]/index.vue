<template>
  <Error :error-string="error" />
  <UserNav :tournament="tournament" />
  <PublicContainer>
    <PrimeDataView :value="items">
      <template #list="{ items }">
        <div v-for="(item, index) in items" :key="index" class="flex flex-wrap justify-between py-2"
          :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
          {{ getTitle(item) }}
          <div class="flex gap-2">
            <NuxtLink :to="getUrl(item)" target="_blank">
              <PrimeButton icon="pi pi-external-link" :title="$t('public.button.open')"></PrimeButton>
            </NuxtLink>
            <PrimeButton icon="pi pi-qrcode" :title="$t('public.button.qr')" @click.prevent="showQr($event, item)" />
          </div>
        </div>
      </template>
      <!-- <PrimeColumn field="title">
        <template #body="{ data }">
          {{ getTitle(data) }}
        </template>
      </PrimeColumn>
      <PrimeColumn frozen align-frozen="right" class="w-20" field="mat" :header="$t('labels.actions')">
        <template #body="{ data }">
          <div class="flex gap-2">
            <NuxtLink :to="getUrl(data)" target="_blank">
              <PrimeButton icon="pi pi-external-link" :title="$t('public.button.open')"></PrimeButton>
            </NuxtLink>
            <PrimeButton icon="pi pi-qrcode" :title="$t('public.button.qr')" @click.prevent="showQr($event, data)" />
          </div>
        </template>
      </PrimeColumn> -->
    </PrimeDataView>
    <PrimeOverlayPanel ref="op">
      <img :src="qr" :alt="qrString" class="w-36 max-w-4xl join-item" />
    </PrimeOverlayPanel>
  </PublicContainer>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});

import { handleServerError } from '~/src/utils';
import { useQRCode } from '@vueuse/integrations/useQRCode';

const route = useRoute();
const invite = computed(() => route.params.invite);
const resultsPath = computed(() => `/i/${invite.value}/results`);
const items = computed(() => {
  const items = [{ title: 'results' }];
  return items.concat(tournament.value.mats.map((mat, index) => _generateMatItems(mat, index)).flat());
});
const error = ref('');
const qrString = ref();
const qr = useQRCode(qrString);
const op = ref();

const { data: tournament, error: err } = await useFetch(`/api/invites/${invite.value}`);
if (err.value) {
  error.value = handleServerError(err);
}

useHead({
  title: tournament.value.name,
});

function _generateMatItems(mat, index) {
  return [
    { title: 'schedule', mat, index },
    { title: 'announce', mat, index },
    { title: 'judge', judge: 1, mat, index },
    { title: 'judge', judge: 2, mat, index },
    { title: 'judge', judge: 3, mat, index },
    { title: 'judge', judge: 4, mat, index },
    { title: 'judge', judge: 5, mat, index },
  ];
}

function getTitle(data) {
  switch (data.title) {
    case 'results':
      return 'Results / Résultat';
    case 'schedule':
      return `Mat ${data.index + 1} Schedule / Horaire du tapis ${data.index + 1}`;
    case 'announce':
      return `Mat ${data.index + 1} Announce / Announce tapis ${data.index + 1}`;
    case 'judge':
      return `Mat ${data.index + 1} judge ${data.judge} / Tapis ${data.index + 1} juge ${data.judge}`;
  }
}

function getUrl(data) {
  switch (data.title) {
    case 'results':
      return _genUrl(`/i/${invite.value}/results`);
    case 'schedule':
      return _genUrl(`/i/${invite.value}/schedule/${data.index}`);
    case 'announce':
      return _genUrl(`/i/${invite.value}/announce/${data.index}`);
    case 'judge':
      return _genUrl(`/i/${invite.value}/judge/${data.index}/${data.judge}`);
  }
}

function showQr(event, data) {
  qrString.value = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''
    }${getUrl(data)}`;
  op.value.toggle(event);
}
function _genUrl(path) {
  return path;
}
</script>
