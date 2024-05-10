<template>
  <table class="table border">
    <caption class="border border-b-0 text-xl py-2">{{ name }}</caption>
    <thead>
      <tr>
        <th class="w-8 text-center hidden md:table-cell"></th>
        <th class="w-1/2 hidden md:table-cell">Tori</th>
        <th class="w-1/2 hidden md:table-cell">Uke</th>
        <th v-if="showSubTotal" class="w-16 text-center">1</th>
        <th v-if="showSubTotal" class="w-16 text-center">2</th>
        <th v-if="showSubTotal" class="w-16 text-center">3</th>
        <th v-if="showSubTotal" class="w-16 text-center">4</th>
        <th v-if="showSubTotal" class="w-16 text-center">5</th>
        <th class="w-24 text-center">Total</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(match, matchIndex) in matches">
        <tr class="md:hidden">
          <td :colspan="colspan">({{ matchIndex + 1 }}) {{ match.tori }} / {{ match.uke }}</td>
        </tr>
        <tr>
          <td class="text-center hidden md:table-cell"><span class="hidden md:table-cell">{{ matchIndex + 1 }}</span>
          </td>
          <td class="hidden md:table-cell">{{ match.tori }}</td>
          <td class="hidden md:table-cell">{{ match.uke }}</td>
          <td v-if="showSubTotal" class="text-center border h-6">{{ match.scores[0] }}</td>
          <td v-if="showSubTotal" class="text-center border h-6">{{ match.scores[1] }}</td>
          <td v-if="showSubTotal" class="text-center border h-6">{{ match.scores[2] }}</td>
          <td v-if="showSubTotal" class="text-center border h-6">{{ match.scores[3] }}</td>
          <td v-if="showSubTotal" class="text-center border h-6">{{ match.scores[4] }}</td>
          <td class="w-24 text-center">{{ match.total }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
const DEFAULT_SPAN = 6;
const props = defineProps(['name', 'showSubTotal', 'matches']);
const colspan = computed(() => props.showSubTotal ? DEFAULT_SPAN : DEFAULT_SPAN - 5);
</script>
