<template>
  <div v-if="text" class="toast toast-top z-50">
    <div class="alert alert-error">
      <h1 class="text-xl font-bold uppercase">{{ text }}</h1>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['errorString']);
const text = ref('');

watch(() => props.errorString, (newValue) => {
  if (newValue) {
    _setError(newValue);
  }
});

let timeoutId;
function _setError(errorString) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  text.value = errorString;
  timeoutId = setTimeout(() => {
    text.value = '';
  }, 3000);
}

_setError(props.errorString);
</script>
