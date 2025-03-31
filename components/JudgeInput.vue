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
    <label class="label" for="nnk">
      <span class="label-text">{{ getKataName('nnk') }}</span>
    </label>
    <select id="nnk" class="select select-bordered" v-model="judge.nnk">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="knk">
      <span class="label-text">{{ getKataName('knk') }}</span>
    </label>
    <select id="knk" class="select select-bordered" v-model="judge.knk">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="jnk">
      <span class="label-text">{{ getKataName('jnk') }}</span>
    </label>
    <select id="jnk" class="select select-bordered" v-model="judge.jnk">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="kgj">
      <span class="label-text">{{ getKataName('kgj') }}</span>
    </label>
    <select id="kgj" class="select select-bordered" v-model="judge.kgj">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="kink">
      <span class="label-text">{{ getKataName('kink') }}</span>
    </label>
    <select id="kink" class="select select-bordered" v-model="judge.kink">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="konk">
      <span class="label-text">{{ getKataName('konk') }}</span>
    </label>
    <select id="konk" class="select select-bordered" v-model="judge.konk">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="ink">
      <span class="label-text">{{ getKataName('ink') }}</span>
    </label>
    <select id="ink" class="select select-bordered" v-model="judge.ink">
      <option v-for="level of Object.keys(LEVEL_MAP)" :value="level">{{ getLevelName(level) }}</option>
    </select>
  </div>
</template>

<script setup>
import { LEVEL_MAP, PROVINCE_MAP, getKataName, getLevelName, getProvinceName } from '~/src/utils';
const props = defineProps(['judge']);
</script>
