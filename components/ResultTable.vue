<template>
  <table class="table bg-base-100 overflow-auto text-lg border">
    <thead class="text-lg">
      <tr>
        <th class="w-8 text-center"></th>
        <th class="w-1/2">Tori</th>
        <th class="w-1/2">Uke</th>
        <th v-if="showSubTotal" class="w-16 text-center">1</th>
        <th v-if="showSubTotal" class="w-16 text-center">2</th>
        <th v-if="showSubTotal" class="w-16 text-center">3</th>
        <th v-if="showSubTotal" class="w-16 text-center">4</th>
        <th v-if="showSubTotal" class="w-16 text-center">5</th>
        <th class="w-24 text-center">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(match, matchIndex) in matches">
        <td class="text-center">{{ matchIndex + 1 }}</td>
        <td>{{ match.tori }}</td>
        <td>{{ match.uke }}</td>
        <td v-if="showSubTotal" class="text-center">{{ match.scores[0] }}</td>
        <td v-if="showSubTotal" class="text-center">{{ match.scores[1] }}</td>
        <td v-if="showSubTotal" class="text-center">{{ match.scores[2] }}</td>
        <td v-if="showSubTotal" class="text-center">{{ match.scores[3] }}</td>
        <td v-if="showSubTotal" class="text-center">{{ match.scores[4] }}</td>
        <td class="w-24 text-center">{{ match.total }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps(['showSubTotal', 'matches']);
</script>

<style scoped>
@media print {
  table {
    @apply border;
  }
}
</style>
