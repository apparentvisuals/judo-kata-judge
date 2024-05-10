<template>
  <div class="flex flex-wrap gap-2 items-center p-2 border-b">
    <img :src="getOrganizationImage(tournament.org)" class="h-12" />
    <h1 class="text-xl">{{ title }}</h1>
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
