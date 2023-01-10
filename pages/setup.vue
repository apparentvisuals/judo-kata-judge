<template>
  <div class="bg bg-base-200 h-full flex">
    <div class="m-auto max-w-xs max-h-96">
      <form v-show="!created" :valid="isValid" @submit.prevent="submit">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="code">
            <span class="label-text">Admin Code</span>
          </label>
          <input id="code" name="code" type="text" class="input input-bordered" v-model="code" />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label" for="name">
            <span class="label-text">Name</span>
          </label>
          <input id="name" name="name" type="text" class="input input-bordered" v-model="name" />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label" for="mats">
            <span class="label-text">Number of Mats</span>
          </label>
          <input id="mats" name="mats" type="number" min="1" max="5" class="input input-bordered"
            v-model.number="numberOfMats" />
        </div>
        <button type="submit" class="btn mt-4">Create</button>
      </form>
      <div v-show="created">
        <div class="text-center">Tournament Code</div>
        <div class="text-xl text-center pb-8">{{ auth }}</div>
        <nuxt-link to="/tournament" class="btn">Setup Tournament</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const code = useState('code', () => '');
const name = useState('name', () => '');
const numberOfMats = useState('numberOfMats', () => 0);
const isValid = useState('isValid', () => false);
const auth = useAuth();
const created = useState('created', () => false);

async function submit() {
  const result = await $fetch(`/api/tournament`, { method: 'POST', body: { name: name.value, numberOfMats: numberOfMats.value }, headers: { authorization: `Bearer ${code.value}` } });
  auth.value = result.id;
  created.value = true;
}
</script>
