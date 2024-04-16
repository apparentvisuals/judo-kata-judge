<template>
  <HlDisclosure as="nav" class="bg-surface-100 dark:bg-surface-900 border-b border-surface-300 dark:border-surface-600"
    v-slot="{ open }">
    <div class="mx-auto px-2 sm:px-4">
      <div class="relative flex h-16 items-center justify-between">
        <div v-if="menu" class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <HlDisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-surface-800 dark:text-surface-100 hover:bg-surface-300 dark:hover:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <span v-if="!open" class="pi pi-bars" aria-hidden="true" />
            <span v-else class="pi pi-times" aria-hidden="true" />
          </HlDisclosureButton>
        </div>
        <div class="flex flex-1"
          :class="menu ? 'items-center justify-center sm:items-stretch sm:justify-start' : 'items-stretch justify-start'">
          <div class="flex flex-shrink-0 items-center text-surface-800 dark:text-surface-300">
            <slot name="left" />
          </div>
          <div v-if="menu" class="hidden sm:block ml-2">
            <div class="flex space-x-4">
              <slot name="menu" />
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <slot name="right" />
          <LocaleMenu />
        </div>
      </div>
    </div>
    <HlDisclosurePanel v-if="menu" class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <slot name="menu" />
      </div>
    </HlDisclosurePanel>
  </HlDisclosure>
</template>

<script setup>
const props = defineProps(['menu']);
</script>
