<template>
  <PrimePanel>
    <PrimeDataTable striped-rows scrollable scroll-height="flex" :value="matches">
      <PrimeColumn field="index" class="w-8">
        <template #body="{ index }">
          {{ index + 1 }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="tori" header="Tori" />
      <PrimeColumn field="uke" header="Uke" />
      <PrimeColumn v-if="showSubTotal" field="one" header="1" class="w-16">
        <template #body="{ data }">
          <span v-if="data.scores[0]">{{ data.scores[0] }}</span>
          <span v-else>-</span>
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="showSubTotal" field="two" header="2" class="w-16">
        <template #body="{ data }">
          <span v-if="data.scores[1]">{{ data.scores[1] }}</span>
          <span v-else>-</span>
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="showSubTotal" field="three" header="3" class="w-16">
        <template #body="{ data }">
          <span v-if="data.scores[2]">{{ data.scores[2] }}</span>
          <span v-else>-</span>
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="showSubTotal" field="four" header="4" class="w-16">
        <template #body="{ data }">
          <span v-if="data.scores[3]">{{ data.scores[3] }}</span>
          <span v-else>-</span>
        </template>
      </PrimeColumn>
      <PrimeColumn v-if="showSubTotal" field="five" header="5" class="w-16">
        <template #body="{ data }">
          <span v-if="data.scores[4]">{{ data.scores[4] }}</span>
          <span v-else>-</span>
        </template>
      </PrimeColumn>
      <PrimeColumn field="total" header="Total" class="w-16" />
    </PrimeDataTable>
  </PrimePanel>
</template>

<script setup>
const props = defineProps(['name', 'showSubTotal', 'matches']);
</script>
