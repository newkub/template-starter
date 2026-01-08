import checker from "vite-plugin-checker";

export default defineNuxtConfig({
  compatibilityDate: "latest",
  devtools: { enabled: true },
  modules: [
    "@vue-macros/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@scalar/nuxt",
    "@nuxt/icon",
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

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        routes: [
          {
            pattern: "*your-domain.com",
            custom_domain: true,
          },
        ]
      }
    },
  },

  routeRules: {

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
    ],
  }
});
