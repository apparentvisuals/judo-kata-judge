<template>
  <div class="flex min-h-10 min-w-10 items-center justify-center">
    <i class="pi pi-times md:text-xl lg:text-2xl xl:text-3xl" v-if="binary && modelValue === '1'" />
    <i class="pi pi-plus md:text-xl lg:text-2xl xl:text-3xl" v-if="!binary && modelValue === '+'" />
    <i class="pi pi-minus md:text-xl lg:text-2xl xl:text-3xl" v-if="!binary && modelValue === '-'" />
  </div>
</template>

<script setup>
const modelValue = defineModel();
const props = defineProps({
  binary: Boolean,
  hidden: Boolean,
  hint: String
});
</script>
