<template>
  <NavBar :menu="false"></NavBar>
  <div class="fixed top-20 bottom-0 w-full flex items-center justify-center">
    <form valid="isValid" @submit.prevent="submit">
      <div class="flex flex-col gap-1">
        <label for="code" class="dark:text-surface-200 text-sm">
          <span>{{ $t('labels.adminCode') }}</span>
        </label>
        <PrimePassword input-id="code" v-model="code" :disabled="inAction" :feedback="false" toggle-mask />
        <small class="text-red-500 dark:text-red-400 inline-block">
          <span for="code" v-show="error">{{ error }}</span>
        </small>
      </div>
      <div class="mt-4 flex content-start items-center">
        <PrimeButton type="submit" :disabled="inAction">
          <span v-if="!inAction">{{ $t('buttons.submit') }}</span>
          <PrimeProgressSpinner v-else stroke-width="4" class="h-6 w-6 fill-surface-0 dark:fill-surface-700"
            aria-label="loading" />
        </PrimeButton>
      </div>
    </form>
  </div>
</template>

<script setup>
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
    if (code.value.length === 0) {
      error.value = 'Password can not be empty';
      return;
    }
    error.value = '';
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
