<template>
  <div class="modal modal-bottom sm:modal-middle cursor-pointer" :class="model ? 'modal-open' : ''">
    <div class="modal-box">
      <div class="form-control w-full">
        <label class="label" for="group-name">
          <span class="label-text">Name</span>
        </label>
        <input id="group-name" type="text" class="input input-bordered" v-model="data.name" autocomplete="off" />
      </div>
      <div class="form-control w-full">
        <label class="label" for="group-kata">
          <span class="label-text">Kata</span>
        </label>
        <select id="group-kata" class="select select-bordered" v-model="data.kata">
          <option v-for="kata of Object.keys(KATA_MAP)" :value="kata">{{ getKataName(kata) }}</option>
        </select>
      </div>
      <div class="form-control w-full">
        <label class="label" for="group-numberOfJudges">
          <span class="label-text">Number of Judges</span>
        </label>
        <input id="group-numberOfJudges" type="number" min="1" max="5" class="input input-bordered"
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
