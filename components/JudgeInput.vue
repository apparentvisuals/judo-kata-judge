<template>
  <div class="form-control w-full">
    <label class="label" for="name">
      <span class="label-text">Name</span>
    </label>
    <input id="name" name="name" type="text" class="input input-bordered" v-model="judge.name" required />
  </div>
  <div class="form-control w-full">
    <label class="label" for="province">
      <span class="label-text">Region</span>
    </label>
    <select id="province" class="select select-bordered" v-model="judge.region">
      <option v-for="province of Object.keys(PROVINCE_MAP)" :value="province">
        {{ getProvinceName(province) }}
      </option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="level">
      <span class="label-text">Level</span>
    </label>
    <select id="level" class="select select-bordered" v-model="judge.rank">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
</template>

<script setup>
import { LEVEL_MAP, PROVINCE_MAP, getLevelName, getProvinceName } from '~/src/utils';
const props = defineProps(['judge']);
</script>
