<template>
  <table class="table border">
    <thead>
      <tr>
        <th class="w-8 text-center hidden md:table-cell"></th>
        <th class="w-1/2 hidden md:table-cell">Tori</th>
        <th class="w-1/2 hidden md:table-cell">Uke</th>
        <td v-if="showSubTotal" v-for="index in judges">{{ index }}</td>
        <th class="w-24 text-center">Total</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(match, matchIndex) in matches">
        <tr class="md:hidden">
          <td :colspan="colspan">({{ matchIndex + 1 }}) {{ match.tori }} / {{ match.uke }}</td>
        </tr>
        <tr>
          <td class="text-center hidden md:table-cell"><span class="hidden md:table-cell">{{ matchIndex + 1 }}</span></td>
          <td class="hidden md:table-cell">{{ match.tori }}</td>
          <td class="hidden md:table-cell">{{ match.uke }}</td>
          <td v-if="showSubTotal" v-for="index in judges">{{ match.scores[index - 1] }}</td>
          <td class="w-24 text-center">{{ match.total }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
const DEFAULT_SPAN = 6;
const props = defineProps(['showSubTotal', 'matches', 'judges']);
const colspan = computed(() => props.showSubTotal ? DEFAULT_SPAN : DEFAULT_SPAN - 5);
</script>
