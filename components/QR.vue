<template>
  <div class="flex flex-col items-center">
    <img :src="qr" :alt="`${title} link QR code`" class="w-36 max-w-4xl join-item" />
    <NuxtLink :to="params ? `${url}?${params}` : url" target="_blank" class="p-button">
      {{ title }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { useQRCode } from '@vueuse/integrations/useQRCode';

const props = defineProps(['path', 'title', 'params']);

const url = computed(() => {
  if (props.path) {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''
      }${props.path}`;
  }
  return '';
});
const qr = useQRCode(url);
</script>
