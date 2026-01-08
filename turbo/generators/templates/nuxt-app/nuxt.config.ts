import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "2025-12-28",
	devtools: { enabled: true },
	modules: [
		"@vue-macros/nuxt",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"@pinia/nuxt",
		"nuxt-mcp-dev",
		"@nuxt/icon",
		"@scalar/nuxt",
	],
	alias: {
		"~/shared": "./shared",
	},
	nitro: {
		routeRules: {
			"/api/**": { cors: true },
		},
	},
	vite: {
		plugins: [
			checker({
				overlay: { initialIsOpen: false },
				typescript: true,
				vueTsc: true,
				oxlint: true,
			}),
		],
	},
});
