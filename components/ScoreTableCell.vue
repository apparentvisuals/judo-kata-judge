<template>
  <div class="flex min-h-10 min-w-10 items-center justify-center">
    <XMarkIcon class="h-6 w-6" v-if="binary && modelValue === '1'" />
    <PlusIcon class="h-6 w-6" v-if="!binary && modelValue === '+'" />
    <MinusIcon class="h-6 w-6" v-if="!binary && modelValue === '-'" />
  </div>
</template>

<script setup>
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const modelValue = defineModel();
const props = defineProps({
  binary: Boolean,
  hidden: Boolean,
  hint: String
});
</script>
