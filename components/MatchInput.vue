<template>
  <div class="form-control w-full">
    <label class="label" for="tori">
      <span class="label-text">Tori</span>
    </label>
    <input id="tori" type="text" class="input input-bordered" v-model="match.tori" />
  </div>
  <div class="form-control w-full ">
    <label class="label" for="uke">
      <span class="label-text">Uke</span>
    </label>
    <input id="uke" type="text" class="input input-bordered" v-model=match.uke />
  </div>
</template>

<script setup>
import { KATA_MAP, getKataName } from '~/src/utils';

const props = defineProps(['match']);
</script>
