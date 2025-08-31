<template>
  <!-- <div class="flex items-center justify-center w-[3vw] h-[3vw]"> -->
  <button style="font-size: clamp(2rem, 2vw, 5rem)" class="aspect-square w-full h-auto" :class="iconClass" />
  <!-- </div> -->
</template>

<script setup>
const model = defineModel();
const props = defineProps({
  binary: Boolean,
  hidden: Boolean,
  hint: String
});

const iconClass = computed(() => {
  if (props.binary) {
    return model.value === '1' ? 'pi pi-times' : '';
  } else {
    if (model.value === '+') {
      return 'pi pi-plus';
    } else if (model.value === '-') {
      return 'pi pi-minus';
    } else {
      return '';
    }
  }
});
</script>
