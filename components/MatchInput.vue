<template>
  <div class="form-control w-full">
    <label class="label" for="tori">
      <span class="label-text">Tori</span>
    </label>
    <input id="tori" type="text" class="input input-bordered" v-model="match.tori" />
  </div>
  <div class="form-control w-full" v-show="match.tori && matchedTori.length > 0">
    <label class="label" for="suggestedTori">
      <span class="label-text">Athlete</span>
    </label>
    <select id="suggestedTori" class="select select-bordered" v-model="foundTori">
      <option v-for="tori of matchedTori" :value="tori">{{ tori.name }} ({{ getProvinceName(tori.region) }})</option>
    </select>
  </div>
  <div class="form-control w-full ">
    <label class="label" for="uke">
      <span class="label-text">Uke</span>
    </label>
    <input id="uke" type="text" class="input input-bordered" v-model=match.uke />
  </div>
  <div class="form-control w-full" v-show="match.uke && matchedUke.length > 0">
    <label class="label" for="suggestedUke">
      <span class="label-text">Athlete</span>
    </label>
    <select id="suggestedUke" class="select select-bordered" v-model="foundUke">
      <option v-for="uke of matchedUke" :value="uke">{{ uke.name }} ({{ getProvinceName(uke.region) }})</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getProvinceName } from '~/src/utils';

const props = defineProps(['match', 'athletes']);
const matchedTori = ref([]);
const matchedUke = ref([]);
const foundTori = ref(undefined);
const foundUke = ref(undefined);

watch(props.match, async (newMatch) => {
  console.log('watch match');
  if (newMatch.tori) {
    let matched = [];
    if (newMatch.tori.length > 4) {
      matched = props.athletes.filter((athlete) => athlete.name.toLowerCase().search(newMatch.tori.toLowerCase()) != -1);
    }
    matchedTori.value = matched;
    if (matched.length === 0) {
      foundTori.value = undefined;
    }
    if (newMatch.toriId) {
      foundTori.value = matched.find((athlete) => athlete.id === newMatch.toriId);
    }
  }
  if (newMatch.uke) {
    let matched = [];
    if (newMatch.uke.length > 4) {
      matched = props.athletes.filter((athlete) => athlete.name.toLowerCase().search(newMatch.uke.toLowerCase()) != -1);
    }
    matchedUke.value = matched;
    if (matched.length === 0) {
      foundUke.value = undefined;
    }
    if (newMatch.ukeId) {
      foundUke.value = matched.find((athlete) => athlete.id === newMatch.ukeId);
    }
  }
});

watch(foundTori, (newValue) => {
  if (newValue && newValue.name) {
    props.match.tori = newValue.name;
    props.match.toriId = newValue.id;
  } else {
    props.match.toriId = undefined;
  }
});

watch(foundUke, (newValue) => {
  if (newValue && newValue.name) {
    props.match.uke = newValue.name;
    props.match.ukeId = newValue.id;
  } else {
    props.match.ukeId = undefined;
  }
})
</script>
