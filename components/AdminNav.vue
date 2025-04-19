<template>
  <PrimeMenubar :model="items" class="rounded-none border-0 fixed top-0 left-0 right-0 z-50 shadow-md">
    <template #start>
      <span class="pi pi-crown p-2 text-lg" />
    </template>
    <template #item="{ item, props }">
      <nuxt-link v-ripple :to="item.href" class="flex items-center" v-bind="props.action">
        <span>{{ item.name }}</span>
      </nuxt-link>
    </template>
    <template #end>
      <div class="flex gap-2">
        <PrimeButton icon="pi pi-sign-out" :label="$t('buttons.logout')" :title="$t('buttons.logout')" severity="danger"
          @click.prevent="logout" />
        <LocaleMenu />
      </div>
    </template>
  </PrimeMenubar>
</template>

<script setup>
const items = ref([
  { name: 'Tournaments', href: '/admin' },
  { name: 'Judges', href: '/admin/judges' },
  { name: 'Athletes', href: '/admin/athletes' },
]);

const logout = async () => {
  const cookie = useCookie('jkj', { default: () => ({}) })
  cookie.value.adminCode = ''
  await navigateTo('/admin/code')
};
</script>
