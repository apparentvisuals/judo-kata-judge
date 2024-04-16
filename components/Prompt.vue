<template>
  <dialog :id="name" class="modal modal-bottom sm:modal-middle">
    <form id="add-t-form"
      class="modal-box bg-surface-100 dark:bg-surface-900 border border-surface-400 dark:border-surface-700"
      @submit.prevent="submit">
      <slot />
      <div class="modal-action">
        <button v-if="cancellable" for="add-t-form" class="btn btn-sm btn-error btn-outline" type="button"
          @click="close" :disabled="disabled">
          Cancel
        </button>
        <button for="add-t-form" class="btn btn-sm btn-success" type="submit" :disabled="disabled">{{ text }}</button>
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
