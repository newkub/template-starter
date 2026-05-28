// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@unocss/nuxt',
  ],

  app: {
    head: {
      title: 'Tauri Nuxt',
    },
  },

  ssr: false, // Tauri requires SPA mode
})
