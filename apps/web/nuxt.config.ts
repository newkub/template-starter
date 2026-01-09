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
    "nuxt-mcp-dev",
    "@nuxt/icon"
  ],


  alias: {
    '~/shared': './shared'
  },

  typescript: {
		strict: true,
		typeCheck: false,
	},

  nitro: {
    experimental: {
      openAPI: true,
    },
    preset: "cloudflare_module",
    cloudflare: {
            deployConfig: true,
            nodeCompat: true,
            wrangler : {
                routes: [
					{
						pattern: "templates.wrikka.com",
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
        oxlint: true,
      }),
    ],
  }
});