// https://v3.nuxtjs.org/api/configuration/nuxt.config

function isDev() {
  return process.env.NODE_ENV === 'development';
}

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'light', // default theme
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
      'judge': {
        driver: 'azureCosmos',
        endpoint: 'https://judo-kata-judge.documents.azure.com:443/',
        accountKey: process.env.COSMOS_KEY,
        containerName: isDev() ? 'judges-dev' : 'judges',
        databaseName: 'judo-kata-judge'
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
