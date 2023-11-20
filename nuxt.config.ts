// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  vite: {
    vue: {
      script: {
        defineModel: true,
      }
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@vueuse/nuxt'],
  colorMode: {
    preference: 'corporate', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  nitro: {
    storage: {
      'tournament': {
        driver: 'azureCosmos',
        endpoint: 'https://judo-kata-judge.documents.azure.com:443/',
        accountKey: process.env.COSMOS_KEY,
        containerName: 'tournaments',
        databaseName: 'judo-kata-judge'
      },
      'tournament-dev': {
        driver: 'fs',
        base: './data/tournaments'
      },
      'judge': {
        driver: 'azureCosmos',
        endpoint: 'https://judo-kata-judge.documents.azure.com:443/',
        accountKey: process.env.COSMOS_KEY,
        containerName: 'judges',
        databaseName: 'judo-kata-judge'
      },
      'judge-dev': {
        driver: 'fs',
        base: './data/judges'
      },
      'athlete': {
        driver: 'azureCosmos',
        endpoint: 'https://judo-kata-judge.documents.azure.com:443/',
        accountKey: process.env.COSMOS_KEY,
        containerName: 'athletes',
        databaseName: 'judo-kata-judge'
      },
      'athlete-dev': {
        driver: 'fs',
        base: './data/athletes'
      },
      'invite': {
        driver: 'azureCosmos',
        endpoint: 'https://judo-kata-judge.documents.azure.com:443/',
        accountKey: process.env.COSMOS_KEY,
        containerName: 'invites',
        databaseName: 'judo-kata-judge'
      },
      'invite-dev': {
        driver: 'fs',
        base: './data/invites'
      },
      'archive': {
        driver: 'fs',
        base: './data/archive'
      }
    }
  },
  css: [
    '~/assets/css/layout.css'
  ]
})
