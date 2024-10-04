// https://v3.nuxtjs.org/api/configuration/nuxt.config
import path from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },

  vite: {
    vue: {
      script: {
        defineModel: true,
      }
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/i18n', '@vueuse/nuxt', 'nuxt-primevue', 'nuxt-headlessui'],

  colorMode: {
    classSuffix: '',
  },

  i18n: {
    strategy: 'no_prefix',
    vueI18n: './i18n.config.js',
  },

  primevue: {
    options: {
      unstyled: true,
      ripple: true
    },
    components: {
      prefix: 'Prime'
    },
    importPT: { from: path.resolve(__dirname, './presets/wind/') },
  },

  headlessui: {
    prefix: 'Hl'
  },

  nitro: {
    storage: {
      'tournaments-dev': {
        driver: 'fs',
        base: './data/tournaments'
      },
      'judges-dev': {
        driver: 'fs',
        base: './data/judges'
      },
      'athletes-dev': {
        driver: 'fs',
        base: './data/athletes'
      },
      'invites-dev': {
        driver: 'fs',
        base: './data/invites'
      }
    }
  },

  css: [
    '~/assets/css/base.css',
    '/node_modules/primeicons/primeicons.css'
  ],

  compatibilityDate: '2024-10-04'
})