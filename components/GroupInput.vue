<template>
  <PrimeForm v-slot="$form" :initial-values :resolver validate-on-mount @submit="onSubmit" class="flex flex-col gap-4">
    <PrimeIftaLabel>
      <PrimeInputText id="group-name" name="name" fluid />
      <label class="label" for="group-name">Name</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeSelect input-id="group-kata" name="kata" :options="objectToPairs(KATA_MAP)" option-label="value"
        option-value="key" fluid />
      <label for="group-kata">Kata</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeInputNumber input-id="group-numberOfJudges" name="numberOfJudges" :min="1" :max="5" :step="1" fluid
        show-buttons />
      <label for="group-numberOfJudges">Number of Judges</label>
    </PrimeIftaLabel>
    <PrimeIftaLabel>
      <PrimeDatePicker input-id="startTime" name="startTime" fluid timeOnly hourFormat="24" />
      <label for="startTime">Start Time</label>
    </PrimeIftaLabel>
    <div class="flex items-center gap-2">
      <PrimeCheckbox input-id="group-disableDivideByHalf" name="disableDivideByHalf" binary />
      <label for="group-disableDivideByHalf">Don't divide total by half on forgotten techniques?</label>
    </div>
    <div class="flex items-center gap-2">
      <PrimeCheckbox input-id="disableForgotten" name="disableForgotten" binary />
      <label for="disableForgotten">Don't allow forgotten techniques?</label>
    </div>
    <div class="flex items-center gap-2">
      <PrimeCheckbox input-id="disableMajor" name="disableMajor" binary />
      <label for="disableMajor">Don't allow major/big mistakes?</label>
    </div>
    <div class="flex justify-end gap-2">
      <PrimeButton severity="secondary" @click="onCancel">Cancel</PrimeButton>
      <PrimeButton raised type="submit" :disabled="!$form.valid">Submit</PrimeButton>
    </div>
  </PrimeForm>
</template>

<script setup>
import { parse } from 'date-fns';
import { Form as PrimeForm } from '@primevue/forms';

import { KATA_MAP, objectToPairs } from '~/src/utils';

const prop = defineProps(['group']);
const emit = defineEmits(['submit', 'cancel']);

const initialValues = reactive({
  name: prop.group && prop.group.name || '',
  kata: prop.group && prop.group.kata || '',
  numberOfJudges: prop.group && prop.group.numberOfJudges || 3,
  startTime: prop.group && prop.group.startTime || '',
  disableDivideByHalf: prop.group && prop.group.disableDivideByHalf || false,
  disableForgotten: prop.group && prop.group.disableForgotten || false,
  disableMajor: prop.group && prop.group.disableMajor || false,
});

const resolver = ({ values }) => {
  const errors = {};
  if (!values.kata) {
    errors.kata = [{ message: 'Kata is required' }]
  }
  if (!values.numberOfJudges) {
    errors.numberOfJudges = [{ message: 'Number of judges is required' }]
  }
  if (values.startTime) {
    try {
      const parsedTime = parse(values.startTime, 'HH:mm', new Date());
      if (isNaN(parsedTime)) {
        errors.startTime = [{ message: 'Invalid start time' }]
      }
    } catch (e) {
      errors.startTime = [{ message: 'Invalid start time' }]
    }
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
