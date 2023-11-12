<template>
  <div class="form-control w-full">
    <label class="label" for="group-name">
      <span class="label-text">Name</span>
    </label>
    <input id="group-name" type="text" class="input input-bordered" v-model="group.name" autocomplete="off" />
  </div>
  <div class="form-control w-full">
    <label class="label" for="group-kata">
      <span class="label-text">Kata</span>
    </label>
    <select id="group-kata" class="select select-bordered" v-model="group.kata" required>
      <option v-for="kata of Object.keys(KATA_MAP)" :value="kata">{{ getKataName(kata) }}</option>
    </select>
  </div>
  <div class="form-control w-full">
    <label class="label" for="group-numberOfJudges">
      <span class="label-text">Number of Judges</span>
    </label>
    <input id="group-numberOfJudges" type="range" min="1" max="5" step="1" class="range range-primary"
      v-model.number="group.numberOfJudges" />
    <div class="w-full flex justify-between text-xs px-2">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
    </div>
  </div>
  <div class="form-control w-full">
    <label class="label" for="group-startTime">
      <span class="label-text">Start Time</span>
    </label>
    <input id="group-startTime" type="text" class="input input-bordered join-item" placeholder="09:00"
      v-model="group.startTime" />
  </div>
</template>

<script setup>
import { KATA_MAP, getKataName } from '~/src/utils';

const props = defineProps(['group']);
</script>
