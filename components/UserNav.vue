<template>
  <div class="flex flex-wrap gap-2 p-2 border-b items-center justify-between">
    <h1 class="text-xl md:text-2xl lg:text-3xl font-bold">{{ title }}</h1>
    <!-- <div class="flex gap-1" v-if="tournament.org === 'on'">
      <img class="hidden md:inline md:h-14 lg:h-20" src="/img/sponsors/hatashita.png" />
      <img class="hidden md:inline md:h-14 lg:h-20" src="/img/sponsors/mizuno.png" />
      <img class="hidden md:inline md:h-14 lg:h-20" src="/img/sponsors/fuji.png" />
      <img class="hidden md:inline md:h-14 lg:h-20" :src="getOrganizationImage(tournament.org)" />
    </div> -->
  </div>
</template>

<script setup>
import { getOrganizationImage } from '~/src/utils';

const props = defineProps(['tournament', 'mat']);

const title = computed(() => {
  let title = props.tournament.name;
  if (props.mat) {
    title += ` mat ${parseInt(props.mat) + 1} / tapis ${parseInt(props.mat) + 1}`;
  }
  return title;
});

</script>
