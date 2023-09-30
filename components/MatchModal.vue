<template>
  <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="model ? 'modal-open' : ''">
    <div class="modal-box">
      <div class="form-control w-full">
        <label class="label" for="kata">
          <span class="label-text">Kata</span>
        </label>
        <select id="kata" class="select select-bordered" v-model="data.kata">
          <option v-for="kata of Object.keys(KATA_MAP)" :value="kata">{{ getKataName(kata) }}</option>
        </select>
      </div>
      <div class="form-control w-full">
        <label class="label" for="tori">
          <span class="label-text">Tori</span>
        </label>
        <input id="tori" type="text" class="input input-bordered" v-model="data.tori" />
      </div>
      <div class="form-control w-full ">
        <label class="label" for="uke">
          <span class="label-text">Uke</span>
        </label>
        <input id="uke" type="text" class="input input-bordered" v-model=data.uke />
      </div>
      <div class="form-control w-full">
        <label class="label" for="numberOfJudges">
          <span class="label-text">Number of Judges</span>
        </label>
        <input id="numberOfJudges" type="number" min="1" max="5" class="input input-bordered"
          v-model="data.numberOfJudges" />
      </div>
      <div class="modal-action">
        <button for="add-match-modal" class="btn btn-error btn-outline" @click.prevent="cancel">
          Cancel
        </button>
        <button for="add-match-modal" class="btn btn-primary" @click.prevent="submit">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { KATA_MAP, getKataName } from '~~/src/utils';

const props = defineProps(['data']);
const model = defineModel();
const emit = defineEmits(['submit']);

function cancel() {
  model.value = false;
}

function submit() {
  emit('submit');
}
</script>
