<template>
  <div class="form-control w-full">
    <label class="label" for="kata">
      <span class="label-text">Kata</span>
    </label>
    <select id="kata" class="select select-bordered" v-model="match.kata">
      <option v-for="kata of Object.keys(KATA_MAP)" :value="kata">{{ getKataName(kata) }}</option>
    </select>
  </div>
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
  <div class="form-control w-full">
    <label class="label" for="numberOfJudges">
      <span class="label-text">Number of Judges</span>
    </label>
    <input id="numberOfJudges" type="number" min="1" max="5" class="input input-bordered"
      v-model="match.numberOfJudges" />
  </div>
</template>

<script setup>
import { KATA_MAP, getKataName } from '~/src/utils';

const props = defineProps(['match']);
</script>
