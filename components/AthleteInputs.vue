<template>
  <PrimeForm v-slot="$form" :initial-values :resolver validate-on-mount @submit="onSubmit" class="flex flex-col gap-4">
    <PrimeIftaLabel>
      <PrimeInputText id="name" name="name" fluid autofocus />
      <label for="name">Name</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeSelect input-id="region" name="region" :options="objectToPairs(PROVINCE_MAP)" option-label="value"
        option-value="key" fluid />
      <label for="region">Region</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeSelect input-id="rank" name="rank" :options="objectToPairs(RANK_MAP)" option-label="value"
        option-value="key" fluid />
      <label for="rank">Rank</label>
    </PrimeIftaLabel>
    <div class="flex justify-end gap-2">
      <PrimeButton severity="secondary" @click="onCancel">Cancel</PrimeButton>
      <PrimeButton raised type="submit" :disabled="!$form.valid">Submit</PrimeButton>
    </div>
  </PrimeForm>
</template>

<script setup>
import { Form as PrimeForm } from '@primevue/forms';

import { PROVINCE_MAP, RANK_MAP } from '~/src/utils';
import { objectToPairs } from '../src/utils';

const prop = defineProps(['athlete']);
const emit = defineEmits(['submit', 'cancel']);

const initialValues = reactive({
  name: prop.athlete && prop.athlete.name || '',
  region: prop.athlete && prop.athlete.region || '',
  rank: prop.athlete && prop.athlete.rank || '',
});

const resolver = ({ values }) => {
  const errors = {};
  if (!values.name) {
    errors.name = [{ message: 'Name is required' }]
  }
  if (!values.region) {
    errors.region = [{ message: 'Region is required' }]
  }
  if (!values.rank) {
    errors.rank = [{ message: 'Rank is required' }]
  }
  return { values, errors };
};

const onSubmit = ({ valid, values }) => {
  if (valid) {
    emit('submit', values);
  }
};

const onCancel = () => {
  emit('cancel');
}
</script>
