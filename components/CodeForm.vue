<template>
  <div class="m-auto w-full p-1 xs:w-80 xs:p-0 max-h-96">
    <form valid="isValid" @submit.prevent="emit('submit')">
      <div class="form-control w-full">
        <label class="label" for="code">
          <span class="label-text">{{ title }}</span>
        </label>
        <input id="code" name="code" type="text" class="input input-bordered" v-model="code" />
        <label class="label">
          <span for="code" class="label-text-alt text-error" v-if="error">{{ error }}</span>
        </label>
      </div>
      <button type="submit" class="btn btn-primary mt-4">Submit</button>
    </form>
  </div>
</template>

<script setup>
const code = defineModel();
const props = defineProps(['title', 'error']);
const emit = defineEmits(['submit']);
</script>
