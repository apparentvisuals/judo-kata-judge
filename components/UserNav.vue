<template>
  <PrimeMenubar>
    <template #start>
      <span class="pi pi-crown p-2 text-lg"></span>
      <h1>{{ title }}</h1>
    </template>
  </PrimeMenubar>
</template>

<script setup>
const props = defineProps(['tournament', 'mat']);

const title = computed(() => {
  let title = props.tournament.name;
  if (props.mat) {
    title += ` mat ${parseInt(props.mat) + 1} / tapis ${parseInt(props.mat) + 1}`;
  }
  return title;
});

</script>
