<template>
  <PrimeForm v-slot="$form" :initialValues :resolver validate-on-mount @submit="onSubmit" class="flex flex-col gap-4">
    <PrimeIftaLabel>
      <PrimeInputText id="name" name="name" fluid autofocus />
      <label for="name">Name</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeSelect input-id="region" name="region" :options="objectToPairs(PROVINCE_MAP)" option-label="value"
        option-value="key" fluid />
      <label for="region">Region</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel v-for="key of ['nnk', 'knk', 'jnk', 'kgj', 'kink', 'konk', 'ink']" :key>
      <PrimeSelect :input-id="key" :name="key" :options="certificationLevels" option-label="value" option-value="key"
        fluid />
      <label :for="key">{{ getKataName(key) }}</label>
    </PrimeIftaLabel>
    <div class="flex justify-end gap-2">
      <PrimeButton severity="secondary" @click="onCancel">Cancel</PrimeButton>
      <PrimeButton raised type="submit" :disabled="!$form.valid">Submit</PrimeButton>
    </div>
  </PrimeForm>
</template>

<script setup>
import { Form as PrimeForm } from '@primevue/forms';
import { LEVEL_MAP, PROVINCE_MAP, getKataName, getLevelName, objectToPairs } from '~/src/utils';

const prop = defineProps(['judge']);
const emit = defineEmits(['submit', 'cancel']);

const initialValues = reactive({
  name: prop.judge && prop.judge.name || '',
  region: prop.judge && prop.judge.region || 'on',
  nnk: prop.judge && prop.judge.knk || '',
  knk: prop.judge && prop.judge.knk || '',
  jnk: prop.judge && prop.judge.jnk || '',
  kgj: prop.judge && prop.judge.kgj || '',
  kink: prop.judge && prop.judge.kink || '',
  konk: prop.judge && prop.judge.konk || '',
  ink: prop.judge && prop.judge.ink || '',
});

const resolver = ({ values }) => {
  const errors = {};
  if (!values.name) {
    errors.name = [{ message: 'Name is required' }]
  }
  return { values, errors };
};

const getLocalLevelName = (level) => {
  if (!level) {
    return 'Not certified';
  }
  return getLevelName(level);
};

const onSubmit = ({ valid, values }) => {
  if (valid) {
    emit('submit', values);
  }
};

const onCancel = () => {
  emit('cancel');
};

const certificationLevels = computed(() => {
  return Object.entries(LEVEL_MAP).map(([key, value]) => {
    if (key === '') {
      return { key: '', value: 'Not Certified' };
    } else {
      return { key, value };
    }
  });
});
</script>
