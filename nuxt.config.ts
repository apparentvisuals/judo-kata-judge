// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'light', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  // build: {
  //   transpile: ['@heroicons/vue']
  // },
  nitro: {
    storage: {
      'kata': {
        driver: 'redis',
        base: 'kata',
        url: process.env.REDIS_URL,
      },
      'archive': {
        driver: 'fs',
        base: './data/archive'
      }
    }
  },
  css: [
    '~/assets/css/layout.css'
  ],
})
