import checker from 'vite-plugin-checker'

export default defineNuxtConfig({
	compatibilityDate: "latest",
	devtools: { enabled: true },
	modules: [
		"nuxt-mcp-dev",
		"@pinia/nuxt",
		"@unocss/nuxt",
		"@nuxt/icon",
		"@vueuse/nuxt",
		"@nuxtjs/color-mode",
		"@vue-macros/nuxt",
		"@scalar/nuxt",
	],

	scalar: {
		url: 'https://registry.scalar.com/@scalar/apis/galaxy?format=yaml',
	},

	colorMode: {
		classSuffix: "",
		preference: "system",
		fallback: "light",
	},
	nitro: {
		prerender: {
			autoSubfolderIndex: false,
		},
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				routes: [
					{
						pattern: "gen-password.wrikka.com",
						custom_domain: true,
					},
				],
			},	
		},
	},
	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},
	typescript: {
		typeCheck: false,
		strict: true,
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
	},
});
