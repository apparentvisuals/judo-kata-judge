<template>
  <div class="navbar fixed bg-primary top-0 z-50 text-primary-content text-xl">
    <div class="navbar-start">
      <Button icon="pi pi-bars" @click.prevent="toggleMain" aira-haspopup="true" aria-controls="main_menu" />
      <Menu ref="mainMenu" id="main_menu" :popup="true" :model="mainMenuItems">
        <template #item="{ item, props }">
          <nuxt-link :to="item.path" class="flex items-center" v-bind="props.action">
            <span class="pi pi-user" />
            <span class="pl-2">{{ item.label }}</span>
          </nuxt-link>
        </template>
      </Menu>
    </div>
    <div class="navbar-center">
      <h1>{{ props.name }}</h1>
    </div>
    <div class="navbar-end gap-2">
      <Button icon="pi pi-sign-out" :label="$t('buttons.logout')" :title="$t('buttons.logout')" severity="danger"
        @click.prevent="logout" />
      <div>
        <Button icon="pi pi-cog" @click.prevent="toggleSetting" aria-haspopup="true" aria-controls="setting_menu" />
        <Menu ref="settingMenu" id="setting_menu" :popup="true" :model="settingMenuItems" :pt="{ content: '' }">
          <template #submenuheader="{ item }">
            <span class="text-primary-500 dark:text-primary-400 font-bold leading-none">{{ item.label }}</span>
          </template>
          <template #item="{ item, props }">
            <div v-if="item.type === 'language'" class="flex justify-between">
              <SelectButton v-model="currentLocale" :options="localeOptions" option-label="label" option-value="value">
              </SelectButton>
              <SelectButton v-model="currentTheme" :options="colorModeOptions" option-label="value" option-value="value"
                data-key="value">
                <template #option="{ option }">
                  <span :class="option.icon" />
                </template>
              </SelectButton>
            </div>
            <div v-if="item.type === 'size'">
              <InputNumber v-model="textSize" showButtons buttonLayout="horizontal" suffix="%"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" inputClass="w-20 text-center"
                :step="10" :min="80" :max="120" />
            </div>
          </template>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOnRectangleIcon, Bars3Icon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const cookie = useCookie('jkj', { default: () => ({}) });
const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();

const props = defineProps(['name']);

const localeOptions = ref([{ label: 'EN', value: 'en' }, { label: 'FR', value: 'fr' }]);
const colorModeOptions = ref([{ icon: 'pi pi-sun', value: 'light' }, { icon: 'pi pi-moon', value: 'dark' }])
const textSize = ref(100);
const settingMenu = ref();
const settingMenuItems = ref([{
  label: t('labels.language'),
  items: [{
    label: 'Language',
    type: 'language',
    disabled: true
  }],
}, {
  label: t('labels.fontSize'),
  items: [{
    label: 'Font Size',
    type: 'size',
    disabled: true
  }],
}]);
const mainMenu = ref();
const mainMenuItems = ref([{ label: t('titles.tournaments'), path: '/admin' }, { label: t('titles.judges'), path: '/admin/judges' }, { label: t('titles.athletes'), path: '/admin/athletes' }])

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

const currentTheme = computed({
  get() {
    return colorMode.preference;
  },
  set(value) {
    colorMode.preference = value;
  }
});

watch(textSize, (newSize) => {
  const el = document.getElementsByTagName('html');
  el[0].style.fontSize = `${newSize}%`;
});

function logout() {
  cookie.value.adminCode = '';
  navigateTo('/admin/code');
}

const toggleSetting = (event) => {
  settingMenu.value.toggle(event);
}

const toggleMain = (event) => {
  mainMenu.value.toggle(event);
}
</script>
