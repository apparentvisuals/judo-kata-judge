<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId());
</script>
