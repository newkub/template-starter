import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "latest",
  devtools: { enabled: true },
  modules: [
    "@vue-macros/nuxt",
    ["@nuxtjs/color-mode", {
      preference: "system",
      fallback: "light",
      classSuffix: "",
    }],
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-mcp-dev",
    ["@nuxt/icon", {
      serverBundle: {
        collections: ['mdi']
      }
    }],
    "@scalar/nuxt"
  ],

  alias: {
    '~/shared': './shared'
  },

  typescript: {
		strict: true,
		typeCheck: true,
	},

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        routes: [
          {
            pattern: "*web.com",
            custom_domain: true,
          },
        ]
      }
    },
  },

  routeRules: {
    '/sitemap.xml': { isr: false },
    '/robots.txt': { isr: false },
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
