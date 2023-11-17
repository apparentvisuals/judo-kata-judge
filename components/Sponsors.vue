<template>
  <div v-if="region === 'on'">
    Sponsored by:
    <img src="/img/sponsors/hatashita.png" class="w-48" />
  </div>
</template>

<script setup>
const props = defineProps(['region']);
</script>
