<template>
  <div class="flex flex-col gap-1 mb-2">
    <label class="dark:text-surface-200 text-sm" for="name">
      <span>{{ $t('labels.name') }}</span>
    </label>
    <input id="name" name="name" type="text" class="input input-bordered" v-model="tournament.name" required />
  </div>
  <div v-if="!org" class="flex flex-col gap-1 mb-2">
    <label class="dark:text-surface-200 text-sm" for="org">
      <span>{{ $t('labels.org') }}</span>
    </label>
    <select id="org" class="select select-bordered" v-model="tournament.org">
      <option v-for="org of Object.keys(ORG_MAP)" :value="org">
        {{ getOrganization(org) }}
      </option>
    </select>
  </div>
  <div class="flex items-center gap-2">
    <label class="dark:text-surface-200 text-sm" for="showJudgeTotal">
      <span>Show individual judge total on results?</span>
    </label>
    <PrimeCheckbox input-id="showJudgeTotal" v-model="tournament.showJudgeTotals" :binary="true" />
  </div>
</template>

<script setup>
import { ORG_MAP, getOrganization } from '~/src/utils';

const props = defineProps(['tournament', 'org']);
</script>
