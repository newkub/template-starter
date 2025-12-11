
import { ViteMcp } from 'vite-plugin-mcp'
import checker from "vite-plugin-checker";


export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	css: [
		"~/assets/token.css"
	],
	routeRules: {
		"/": { prerender: true },
		"/about": { cors: true },
		"/contact": { cors: true },
		"/services": { cors: true },
		"/projects": { cors: true },
		"/blog": { cors: true },
		"/blog/*": { cors: true },
	},
	modules: [
		"@pinia/nuxt",
		"@unocss/nuxt",
		"@vueuse/nuxt",
		"@nuxtjs/storybook",
		"@nuxtjs/seo",
		"@nuxt/image",
		"nuxt-typed-router",
		"nuxt-seo-utils",
		"@nuxtjs/sitemap",
		"nuxt-og-image",
		"nuxt-schema-org",
		"@nuxtjs/color-mode",
		"motion-v/nuxt",
		"@polar-sh/nuxt",
		"@nuxt/scripts",
		"@vite-pwa/nuxt",
		"@nuxtjs/turnstile",
		"@nuxthq/studio",
		"@nuxt/content",
		"nuxt-pages-plus",
		"@nuxt/eslint",
	],
	eslint : {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
				// ...
			}
		}
	},
	storybook: {
		// การตั้งค่าที่รองรับในเวอร์ชันปัจจุบัน
		port: 6006,
		host: "localhost",
		route: "/__storybook__",
	},
	nitro: {
		preset: "bun",
		experimental: {
			openAPI: true,
		},
	},
	image: {
		cloudflare: {
			baseURL: "https://that-test.site",
		},
	},
	hub: {
		cache: true,
	},
	colorMode: {
		preference: "system",
		fallback: "light",
		hid: "nuxt-color-mode-script",
		globalName: "__NUXT_COLOR_MODE__",
		componentName: "ColorScheme",
		classPrefix: "",
		classSuffix: "",
		storage: "localStorage",
		storageKey: "nuxt-color-mode",
	},
	typescript: {
		typeCheck: true,
		strict: true,
	},
	vite : {
		 plugins: [
    ViteMcp(),
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