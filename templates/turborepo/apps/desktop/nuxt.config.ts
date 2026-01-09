import checker from "vite-plugin-checker";
import tauri from 'vite-plugin-tauri';

export default defineNuxtConfig({
  compatibilityDate: "latest",
  devtools: { enabled: true },
  modules: [
    "@vue-macros/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-mcp-dev",
    "@nuxt/icon",
    "@scalar/nuxt"
  ],

  scalar: {
    url: 'https://registry.scalar.com/@scalar/apis/galaxy?format=yaml',
  },

  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
  },

  icon: {
    serverBundle: {
      collections: ['mdi']
    }
  },

  devServer: {
    host: '0.0.0.0',
  },

  vite: {
    plugins: [
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        vueTsc: true,
      }),
      tauri(),
    ],
  }
});
