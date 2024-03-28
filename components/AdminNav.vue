<template>
  <div class="navbar fixed bg-primary top-0 z-50 text-primary-content text-xl">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-square">
          <Bars3Icon class="w=5 h-5" />
        </label>
        <div tabindex="0" class="dropdown-content mt-3 p-2 shadow-xl bg-base-200 w-40">
          <ul class="menu text-base-content">
            <li><nuxt-link to="/admin">{{ $t('titles.tournaments') }}</nuxt-link></li>
            <li><nuxt-link to="/admin/judges">{{ $t('titles.judges') }}</nuxt-link></li>
            <li><nuxt-link to="/admin/athletes">{{ $t('titles.athletes') }}</nuxt-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="navbar-center">
      <h1>{{ props.name }}</h1>
    </div>
    <div class="navbar-end gap-2">
      <SelectButton v-model="currentLocale" :options="locales"></SelectButton>
      <SelectButton v-model="textSize" :options="[100, 120, 140]"></SelectButton>
      <label class="swap swap-rotate btn btn-square btn-ghost">
        <input type="checkbox" class="theme-controller" v-model="theme" />
        <SunIcon class="h-6 w-6 swap-off" />
        <MoonIcon class="h-6 w-6 swap-on" />
      </label>
      <button class="btn btn-error" @click.prevent="logout" title="Logout">
        <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        {{ $t('buttons.logout') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOnRectangleIcon, Bars3Icon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

import SelectButton from 'primevue/selectbutton';

const { locale, setLocale } = useI18n();
const locales = ref(['en', 'fr']);
const colorMode = useColorMode();
const props = defineProps(['name']);
const cookie = useCookie('jkj', { default: () => ({}) });
const textSize = ref(100);

const currentLocale = computed({
  get() {
    return locale.value;
  },
  async set(value) {
    if (value) {
      await setLocale(value);
    }
  }
});

const theme = computed({
  get() {
    return colorMode.preference === 'corporate';
  },
  set(value) {
    if (value) {
      colorMode.preference = 'corporate';
    } else {
      colorMode.preference = 'business';
    }
  }
});

watch(textSize, (newSize) => {
  const el = document.getElementsByTagName('html');
  el[0].style.fontSize = `${newSize}%`;
});
// function changeLang(event) {
//   setLocale(event.target.value);
// }

function logout() {
  cookie.value.adminCode = '';
  navigateTo('/admin/code');
}
</script>
