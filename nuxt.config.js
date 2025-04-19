// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  devtools: { enabled: true },

  vite: {
    vue: {
      script: {
        defineModel: true,
      }
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/i18n', '@vueuse/nuxt', '@primevue/nuxt-module'],

  colorMode: {
    classSuffix: '',
  },

  i18n: {
    strategy: 'no_prefix',
    vueI18n: '../i18n.config.js',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  primevue: {
    options: {
      theme: 'none',
    },
    components: {
      prefix: 'Prime'
    },
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
    '~/assets/css/tailwind.css',
    '~/assets/css/base.css',
    '/node_modules/primeicons/primeicons.css'
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss': {},
      'autoprefixer': {},
    },
  },

  compatibilityDate: '2025-04-01',
});
