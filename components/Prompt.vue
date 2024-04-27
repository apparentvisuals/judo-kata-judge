<template>
  <dialog :id="name" class="modal modal-bottom sm:modal-middle">
    <form id="add-t-form"
      class="modal-box bg-surface-100 dark:bg-surface-900 border border-surface-400 dark:border-surface-700"
      @submit.prevent="submit">
      <slot />
      <div class="modal-action">
        <PrimeButton v-if="cancellable" for="add-t-form" severity="danger" type="button" @click="close"
          :disabled="disabled">
          Cancel
        </PrimeButton>
        <PrimeButton for="add-t-form" type="submit" :disabled="disabled">{{ text }}
        </PrimeButton>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>

const props = defineProps({
  "name": String,
  "disabled": Boolean,
  "text": String,
  "cancellable": {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['submit']);

function close() {
  window[props.name].close();
}

function submit() {
  close();
  emit('submit');
}
</script>
