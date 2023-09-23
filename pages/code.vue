<template>
  <div class="bg bg-base-200 h-full flex">
    <div class="m-auto max-w-xs max-h-96">
      <form valid="isValid" @submit.prevent="submit">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="code">
            <span class="label-text">Tournament Code</span>
          </label>
          <input id="code" name="code" type="text" class="input input-bordered" v-model="code" />
        </div>
        <button type="submit" class="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
const cookie = useCookie('jkj', { default: () => ({}) });
const auth = useAuth();
const route = useRoute();

const code = useState('code', () => '');

function submit() {
  cookie.value.tCode = code;
  auth.value = code;
  if (route.query.from) {
    navigateTo(route.query.from);
  } else {
    navigateTo('/');
  }
}
</script>
