<template>
  <div class="fixed top-0 bottom-0 w-full flex items-center justify-center">
    <div class="max-w-xs max-h-96">
      <form valid="isValid" @submit.prevent="submit">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="code">
            <span class="label-text">{{ $t('labels.adminCode') }}</span>
          </label>
          <input id="code" name="code" type="text" class="input input-bordered" v-model="code" :disabled="inAction" />
          <label class="label">
            <span for="code" class="label-text-alt text-error" v-show="error">{{ error }}</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary mt-4" :disabled="inAction">
          {{ $t('buttons.submit') }}
          <i v-show="inAction" class="loading loading-spinner loading-xs"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ka } from 'date-fns/locale';
import { handleServerError } from '~/src/utils';

useHead({
  title: 'Kata Admin',
});

const cookie = useCookie('jkj', { default: () => ({}) });
const route = useRoute();

const inAction = ref(false);
const code = ref('');
const error = ref('');

async function submit() {
  try {
    error.value = '';
    if (code.value.length === 0) {
      error.value = 'Password can not be empty';
      return;
    }
    inAction.value = true;
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
  } finally {
    inAction.value = false;
  }
}
</script>
