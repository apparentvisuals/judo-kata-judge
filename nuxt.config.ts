// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  vite: {
    vue: {
      script: {
        defineModel: true,
      }
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/i18n', '@vueuse/nuxt'],
  colorMode: {
    preference: 'corporate', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  i18n: {
    vueI18n: './i18n.config.js',
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
    '~/assets/css/layout.css'
  ]
})
