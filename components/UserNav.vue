<template>
  <div class="navbar text-xl font-bold">
    <div class="navbar-center gap-2 flex-1">
      <img :src="getOrganizationImage(tournament.org)" class="h-12" />
      <h1 class="hidden md:inline">{{ title }}</h1>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { getOrganizationImage } from '~/src/utils';
const props = defineProps(['tournament', 'mat']);

const title = computed(() => {
  let title = props.tournament.name;
  if (props.mat) {
    title += ` Mat ${parseInt(props.mat) + 1}`;
  }
  return title;
});

</script>
