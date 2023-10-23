<template>
  <div class="form-control w-full">
    <label class="label" for="name">
      <span class="label-text">Name</span>
    </label>
    <input id="name" name="name" type="text" class="input input-bordered" v-model="tournament.name" required />
  </div>
  <div class="form-control w-full">
    <label class="label" for="org">
      <span class="label-text">Organization</span>
    </label>
    <select id="org" class="select select-bordered" v-model="tournament.org">
      <option v-for="org of Object.keys(ORG_MAP)" :value="org">
        {{ getOrganization(org) }}
      </option>
    </select>
  </div>
  <div class="form-control">
    <label class="label" for="showJudgeTotal">
      <span class="label-text">Show individual judge total on results?</span>
      <input id="showJudgeTotal" type="checkbox" v-model="tournament.showJudgeTotals" />
    </label>
  </div>
</template>

<script setup>
import { ORG_MAP, getOrganization } from '~/src/utils';

const props = defineProps(['tournament']);
</script>
