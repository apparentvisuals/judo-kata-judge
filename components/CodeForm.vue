<template>
  <div class="w-full flex items-center justify-center">
    <PrimeForm valid="isValid" @submit="emit('submit')" class="flex flex-col gap-4">
      <PrimeMessage severity="error" icon="pi pi-times-circle" v-if="error">{{ error }}</PrimeMessage>
      <PrimeIftaLabel>
        <PrimeInputText id="code" name="code" v-model="code" />
        <label for="code">{{ title }}</label>
      </PrimeIftaLabel>
      <PrimeButton type="submit" :label="$t('buttons.submit')" />
    </PrimeForm>
  </div>
</template>

<script setup>
const code = defineModel();
const props = defineProps(['title', 'error']);
const emit = defineEmits(['submit']);
</script>
