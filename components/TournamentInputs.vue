<template>
  <PrimeForm v-slot="$form" :initialValues :resolver validate-on-mount @submit="onSubmit" class="flex flex-col gap-4">
    <PrimeIftaLabel>
      <PrimeInputText id="name" name="name" fluid autofocus />
      <label for="name"><span>{{ $t('labels.name') }}</span></label>
    </PrimeIftaLabel>
    <PrimeIftaLabel v-if="!org">
      <PrimeSelect input-id="org" name="org" :options="objectToPairs(ORG_MAP)" option-label="value" option-value="key"
        fluid />
      <label for="org">{{ $t('labels.org') }}</label>
    </PrimeIftaLabel>
    <div class="flex items-center gap-2">
      <PrimeCheckbox input-id="showJudgeTotal" name="showJudgeTotals" :binary="true" />
      <label for="showJudgeTotal">Show individual judge total on results</label>
    </div>
    <div class="flex justify-end gap-2">
      <PrimeButton severity="secondary" @click="onCancel">Cancel</PrimeButton>
      <PrimeButton raised type="submit" :disabled="!$form.valid">Submit</PrimeButton>
    </div>
  </PrimeForm>
</template>

<script setup>
import { Form as PrimeForm } from '@primevue/forms';

import { ORG_MAP } from '~/src/utils';
import { objectToPairs } from '../src/utils';

const prop = defineProps(['tournament', 'org']);
const emit = defineEmits(['submit', 'cancel']);

const initialValues = reactive({
  name: prop.tournament && prop.tournament.name || '',
  org: prop.org || prop.tournament && prop.tournament.org || 'jc',
  showJudgeTotals: prop.tournament && prop.tournament.showJudgeTotals || false,
});

const resolver = ({ values }) => {
  const errors = {};
  if (!values.name) {
    errors.name = [{ message: 'Name is required' }]
  }
  if (!values.org) {
    errors.org = [{ message: 'Organization is required' }]
  }
  if (values.showJudgeTotals === undefined) {
    errors.showJudgeTotals = [{ message: 'Show Judge Totals is required' }]
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
