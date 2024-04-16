<template>
  <NavBar :menu="true">
    <template #left>
      <span class="pi pi-crown p-2 text-lg" />
    </template>
    <template #menu>
      <nuxt-link v-for="item in navigation" :key="item.name" :to="item.href"
        :class="[item.current ? 'bg-surface-400 dark:bg-surface-700' : 'hover:bg-surface-400 dark:hover:bg-surface-700', 'text-surface-800 dark:text-white/80 block rounded-md p-2 text-sm font-medium']"
        :aria-current="item.current ? 'page' : undefined">{{ item.name }}</nuxt-link>
    </template>
    <template #right>
      <Button icon="pi pi-sign-out" :label="$t('buttons.logout')" :title="$t('buttons.logout')" severity="danger"
        @click.prevent="logout" class="mr-2 hidden sm:block" />
    </template>
  </NavBar>
</template>

<script setup>
const { t } = useI18n();
const { path } = useRoute();
const cookie = useCookie('jkj', { default: () => ({}) });

const navigation = computed(() => {
  const menu = [
    { name: t('titles.tournaments'), href: '/admin' },
    { name: t('titles.judges'), href: '/admin/judges' },
    { name: t('titles.athletes'), href: '/admin/athletes' },
  ];
  menu.forEach((item) => {
    item.current = path === item.href;
  });
  return menu;
});

function logout() {
  cookie.value.adminCode = '';
  navigateTo('/admin/code');
}
</script>
