<template>
  <div class="form-control w-full">
    <label class="label" for="name">
      <span class="label-text">Name</span>
    </label>
    <input id="name" name="name" type="text" class="input input-bordered" v-model="athlete.name" required />
  </div>
  <div class="form-control w-full">
    <label class="label" for="region">
      <span class="label-text">Province</span>
    </label>
    <select id="region" class="select select-bordered" v-model="athlete.region">
      <option v-for="province of Object.keys(PROVINCE_MAP)" :value="province">
        {{ getProvinceName(province) }}
      </option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="rank">
      <span class="label-text">Rank</span>
    </label>
    <select id="rank" class="select select-bordered" v-model="athlete.rank">
      <option v-for="rank of Object.keys(RANK_MAP)" :value="rank">{{ getRankName(rank) }}</option>
    </select>
  </div>
</template>

<script setup>
import { PROVINCE_MAP, RANK_MAP, getProvinceName, getRankName } from '~~/src/utils';
const props = defineProps(['athlete']);
</script>
