<template>
  <div class="form-control w-full">
    <label class="label" for="name">
      <span class="label-text">Name</span>
    </label>
    <input id="name" name="name" type="text" class="input input-bordered" v-model="tournament.name" required />
  </div>
  <div class="form-control">
    <label class="label" for="showJudgeTotal">
      <span class="label-text">Show individual judge total on results?</span>
      <input type="checkbox" v-model="tournament.showJudgeTotals" />
    </label>
  </div>
</template>

<script setup>
const props = defineProps(['tournament']);
</script>
