<template>
  <td v-if="!hidden">
    <CheckIcon class="h-6 w-6" v-if="binary && modelValue === '1'" />
    <div class="md:hidden h-6 w-6 text-base-300 flex items-center justify-center" v-if="modelValue === ''">{{ hint }}
    </div>
    <PlusIcon class="h-6 w-6" v-if="!binary && modelValue === '+'" />
    <MinusIcon class="h-6 w-6" v-if="!binary && modelValue === '-'" />
  </td>
</template>

<script setup>
import { CheckIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';

const modelValue = defineModel();
const props = defineProps({
  binary: Boolean,
  hidden: Boolean,
  hint: String
});
</script>
