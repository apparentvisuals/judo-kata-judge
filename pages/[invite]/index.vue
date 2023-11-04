<template></template>

<script setup>
import { handleServerError } from '~/src/utils';

const error = ref('');
try {
  const inviteData = await $fetch(`/api/tournaments/${code.value}`);
} catch (err) {
  error.value = handleServerError(err);
}
</script>
