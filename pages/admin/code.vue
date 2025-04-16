<template>
  <NavBar :menu="false"></NavBar>
  <div class="fixed top-20 bottom-0 w-full flex items-center justify-center">
    <PrimeForm v-slot="$form" :resolver validate-on-mount @submit="onSubmit" class="flex flex-col gap-4">
      <PrimeMessage severity="error" icon="pi pi-times-circle" v-if="error">{{ error }}</PrimeMessage>
      <PrimeIftaLabel>
        <PrimePassword input-id="code" name="code" :disabled="inAction" :feedback="false" toggle-mask fluid />
        <label for="code">{{ $t('labels.adminCode') }}</label>
      </PrimeIftaLabel>
      <PrimeButton type="submit" :label="$t('buttons.submit')" :disabled="inAction || !$form.valid" :loading="inAction"
        raised />
    </PrimeForm>
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
const error = ref('');

const resolver = ({ values }) => {
  const errors = {};
  if (!values.code) {
    errors.code = [{ message: 'Password is required' }];
  }
  return { values, errors };
};

async function onSubmit({ valid, values }) {
  if (valid) {
    try {
      error.value = '';
      inAction.value = true;
      const response = await $fetch('/api/login', { headers: { authorization: `Bearer ${values.code}` } });
      cookie.value.adminCode = values.code;
      cookie.value.org = response.org;
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
      inAction.value = false;
    }
  }
}
</script>
