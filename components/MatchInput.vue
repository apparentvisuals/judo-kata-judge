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
    <select id="suggestedUke" class="select select-bordered" v-model="foundTori">
      <option v-for="tori of matchedTori" :value="tori">{{ tori }}</option>
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
      <option v-for="uke of matchedUke" :value="uke">{{ uke }}</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps(['match', 'athletes']);
const matchedTori = useState('matched-tori', () => []);
const matchedUke = useState('matched-uke', () => []);
const foundTori = useState('found-tori', () => undefined);
const foundUke = useState('found-uke', () => undefined);

let lastTori = undefined;
let lastUke = undefined;
watch(props.match, async (newMatch) => {
  console.log(newMatch);
  if (newMatch.tori) {
    if (newMatch.tori.length > 4) {
      lastTori = newMatch.tori;
      matchedTori.value = props.athletes.filter((athlete) => athlete.name.search(lastTori) != -1);
    } else {
      lastTori = undefined;
      matchedTori.value = [];
    }
  }
  if (newMatch.uke) {
    if (newMatch.uke.length > 4) {
      lastUke = newMatch.uke;
      matchedUke.value = props.athletes.filter((athlete) => athlete.name.search(lastUke) != -1);
    } else {
      lastUke = undefined;
      matchedUke.value = [];
    }
  }
});


</script>
