<template>
  <Error :error-string="error" />
  <UserNav :tournament="tournament">
    <div class="navbar-end w-auto" v-if="tournament.org === 'on'">
      <img src="/img/sponsors/hatashita.png" class="h-12" />
    </div>
  </UserNav>
  <div class="p-2 text-xl font-bold md:hidden">
    {{ tournament.name }}
  </div>
  <div class="pt-16">
    <div class="px-12" v-if="tournament.mats">
      <ClientOnly>
        <div class="flex gap-24 flex-wrap py-12" style="page-break-after: always;">
          <QR :path="resultsPath" title="results" params="scroll=1" />
          <template v-for="(_mat, index) of tournament.mats">
            <QR :path="`/i/${invite}/schedule/${index}`" :title="`Mat ${index + 1} Cchedule`" />
            <QR :path="`/i/${invite}/announce/${index}`" :title="`Mat ${index + 1} Announce`" />
          </template>
        </div>
        <div v-for="(_mat, index) of tournament.mats" class="flex gap-24 flex-wrap py-12"
          style="page-break-after: always;">
          <QR :path="`/i/${invite}/judge/${index}/1`" :title="`Mat ${index + 1} Judge 1`" />
          <QR :path="`/i/${invite}/judge/${index}/2`" :title="`Mat ${index + 1} Judge 2`" />
          <QR :path="`/i/${invite}/judge/${index}/3`" :title="`Mat ${index + 1} Judge 3`" />
          <QR :path="`/i/${invite}/judge/${index}/4`" :title="`Mat ${index + 1} Judge 4`" />
          <QR :path="`/i/${invite}/judge/${index}/5`" :title="`Mat ${index + 1} Judge 5`" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  colorMode: 'corporate',
});

import { handleServerError } from '~/src/utils';

const route = useRoute();
const invite = computed(() => route.params.invite);
const resultsPath = computed(() => `/i/${invite.value}/results`);

const error = ref('');
const tournament = ref({});

try {
  tournament.value = await $fetch(`/api/invites/${invite.value}`);
  useHead({
    title: tournament.value.name,
  });
} catch (err) {
  error.value = handleServerError(err);
}

</script>
