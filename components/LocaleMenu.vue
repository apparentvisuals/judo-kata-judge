<template>
  <div>
    <PrimeButton icon="pi pi-cog" @click.prevent="toggleSetting" aria-haspopup="true" aria-controls="setting_menu" />
    <PrimePopover ref="settingMenu" id="setting_menu">
      <div class="flex flex-col gap-2">
        <template v-for="item of settingMenuItems" :key="item.label">
          <span class="text-primary-500 dark:text-primary-400 font-bold leading-none">{{ $t(item.label) }}</span>
          <template v-for="childItem of item.items" :key="childItem.type">
            <div v-if="childItem.type === 'language'">
              <PrimeSelectButton v-model="currentLocale" :options="localeOptions" option-label="label"
                option-value="value" data-key="value" :allow-empty="false">
              </PrimeSelectButton>
            </div>
            <div v-if="childItem.type === 'colour'">
              <PrimeSelectButton v-model="colorMode.preference" :options="colorModeOptions" option-label="value"
                option-value="value" data-key="value" :allow-empty="false"
                class="border-surface-200 dark:border-surface-900">
                <template #option="{ option }">
                  <span :class="option.icon" />
                </template>
              </PrimeSelectButton>
            </div>
            <div v-if="childItem.type === 'size'">
              <PrimeInputNumber v-model="zoom" showButtons buttonLayout="horizontal" suffix="%"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" inputClass="w-24 text-center"
                :step="10" :min="80" :max="200" />
            </div>
          </template>
        </template>
      </div>
    </PrimePopover>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();
const zoom = useCookie('zoom', { default: () => 100 });

const localeOptions = ref([{ label: 'EN', value: 'en' }, { label: 'FR', value: 'fr' }]);
const colorModeOptions = ref([{ icon: 'pi pi-cog', value: 'system' }, { icon: 'pi pi-sun', value: 'light' }, { icon: 'pi pi-moon', value: 'dark' }])

const settingMenu = ref();
const settingMenuItems = ref([{
  label: 'labels.colour',
  items: [{
    type: 'colour',
    disabled: true
  }],
}, {
  label: 'labels.language',
  items: [{
    type: 'language',
    disabled: true
  }],
}, {
  label: 'labels.fontSize',
  items: [{
    type: 'size',
    disabled: true
  }],
}]);

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

onMounted(() => {
  const el = document.getElementsByTagName('html');
  el[0].style.fontSize = `${zoom.value}%`;
});

watch(zoom, (newSize) => {
  const el = document.getElementsByTagName('html');
  el[0].style.fontSize = `${newSize}%`;
});

const toggleSetting = (event) => {
  settingMenu.value.toggle(event);
};
</script>
