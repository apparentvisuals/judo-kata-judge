<template>
  <div class="flex flex-wrap gap-2 items-center p-2 border-b" :class="kiosk ? 'hidden' : ''">
    <img :src="getOrganizationImage(tournament.org)" class="h-12" />
    <h1 class="text-xl">{{ title }}</h1>
  </div>
  <div class="flex flex-wrap gap-2 p-2 border-b items-center justify-between" :class="kiosk ? '' : 'hidden'">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <div class="flex">
      <img class="h-20 p-1" src="/img/sponsors/hatashita.png" />
      <img class="h-20" :src="getOrganizationImage(tournament.org)" />
    </div>
  </div>
</template>

<script setup>
import { getOrganizationImage } from '~/src/utils';

const route = useRoute();
const kiosk = computed(() => route.query.kiosk);

const props = defineProps(['tournament', 'mat']);

const title = computed(() => {
  let title = props.tournament.name;
  if (props.mat) {
    title += ` mat ${parseInt(props.mat) + 1} / tapis ${parseInt(props.mat) + 1}`;
  }
  return title;
});

</script>
