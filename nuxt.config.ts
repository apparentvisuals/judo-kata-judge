// https://v3.nuxtjs.org/api/configuration/nuxt.config

function isDev() {
  return process.env.NODE_ENV === 'development';
}

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'business', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  nitro: {
    storage: {
      'tournament': {
        driver: 'azureCosmos',
        endpoint: 'https://judo-kata-judge.documents.azure.com:443/',
        accountKey: process.env.COSMOS_KEY,
        containerName: isDev() ? 'tournaments-dev' : 'tournaments',
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
        containerName: isDev() ? 'judges-dev' : 'judges',
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
        containerName: isDev() ? 'athletes-dev' : 'athletes',
        databaseName: 'judo-kata-judge'
      },
      'athlete-dev': {
        driver: 'fs',
        base: './data/athletes'
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
