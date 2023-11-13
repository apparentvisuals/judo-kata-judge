<template>
  <div class="bg bg-base-200 h-full flex">
    <div class="m-auto max-w-xs max-h-96">
      <form valid="isValid" @submit.prevent="submit">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="code">
            <span class="label-text">Admin Code</span>
          </label>
          <input id="code" name="code" type="text" class="input input-bordered" v-model="code" />
          <label class="label">
            <span for="code" class="label-text-alt text-error" v-if="error">{{ error }}</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { handleServerError } from '~/src/utils';

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const code = ref('');
const error = ref('');

async function submit() {
  try {
    await $fetch('/api/login', { headers: { authorization: `Bearer ${code.value}` } });
    cookie.value.adminCode = code.value;
    if (route.query.from) {
      navigateTo(route.query.from);
    } else {
      navigateTo('/admin');
    }
  } catch (err) {
    if (err.response && err.response.status === 403) {
      error.value = 'Invalid password';
    } else {
      error.value = handleServerError(err);
    }
  }
}
</script>
