import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
	test: {
		environmentOptions: {
			nuxt: {
				mock: {
					intersectionObserver: true,
					indexedDb: true,
				},
			},
		},
		globals: true,
		environment: "happy-dom",
		setupFiles: [],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
	},
});
