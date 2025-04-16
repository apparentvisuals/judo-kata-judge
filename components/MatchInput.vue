<template>
  <PrimeForm v-slot="$form" :initial-values :resolver validate-on-mount @submit="onSubmit" class="flex flex-col gap-4">
    <PrimeIftaLabel>
      <PrimeAutoComplete input-id="tori" name="tori" :suggestions="matchedTori" option-label="name"
        @complete="searchTori" fluid />
      <label for="tori">Tori</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeAutoComplete input-id="uke" name="uke" :suggestions="matchedUke" option-label="name" @complete="searchUke"
        fluid />
      <label for="uke">Uke</label>
    </PrimeIftaLabel>
    <div class="flex justify-end gap-2">
      <PrimeButton severity="secondary" @click="onCancel">Cancel</PrimeButton>
      <PrimeButton raised type="submit" :disabled="!$form.valid">Submit</PrimeButton>
    </div>
  </PrimeForm>
</template>

<script setup>
import { Form as PrimeForm } from '@primevue/forms';

const prop = defineProps(['match', 'athletes']);
const emit = defineEmits(['submit', 'cancel']);

const matchedTori = ref([]);
const matchedUke = ref([]);

const initialValues = reactive({
  tori: prop.match && prop.match.tori || '',
  toriId: prop.match && prop.match.toriId || undefined,
  uke: prop.match && prop.match.uke || '',
  ukeId: prop.match && prop.match.ukeId || undefined,
});

const resolver = ({ values }) => {
  const errors = {};
  if (!values.tori) {
    errors.tori = [{ message: 'Tori is required' }];
  }
  if (!values.uke) {
    errors.uke = [{ message: 'Uke is required' }];
  }
  return { values, errors };
};

const searchTori = async (event) => {
  setTimeout(() => {
    if (event.query.length > 2) {
      matchedTori.value = prop.athletes.filter((athlete) => athlete.name.toLowerCase().search(event.query.toLowerCase()) != -1);
    } else {
      matchedTori.value = [...prop.athletes];
    }
  }, 250);
};

const searchUke = async (event) => {
  if (event.query.length > 4) {
    matchedUke.value = prop.athletes.filter((athlete) => athlete.name.toLowerCase().search(event.query.toLowerCase()) != -1);
  } else {
    matchedUke.value = [];
  }
};

const onSubmit = ({ valid, values }) => {
  if (valid) {
    if (typeof values.tori === 'object') {
      values.toriId = values.tori.id;
      values.tori = values.tori.name;
    } else {
      values.toriId = undefined;
    }
    if (typeof values.uke === 'object') {
      values.ukeId = values.uke.id;
      values.uke = values.uke.name;
    } else {
      values.ukeId = undefined;
    }
    emit('submit', values);
  }
};

const onCancel = () => {
  emit('cancel');
};
</script>
