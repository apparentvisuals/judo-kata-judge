<template>
  <div class="flex items-center min-w-6 min-h-6">
    <XMarkIcon class="h-6 w-6" v-if="binary && modelValue === '1'" />
    <!-- <div class="md:hidden h-6 w-6 text-base-300 flex items-center justify-center" v-if="modelValue === ''">
      {{ hint }}
    </div> -->
    <!-- <div class="hidden h-6 w-6 md:block" v-if="modelValue === ''" /> -->
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
