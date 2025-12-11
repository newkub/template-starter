import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";

export default defineConfig<ConfigOptions>({
	testDir: "./e2e",
	timeout: 90 * 1000,
	reporter: [
		["list"],
		["@midscene/web/playwright-reporter", { type: "merged" }],
	],
	use: {
		nuxt: {
			rootDir: fileURLToPath(new URL(".", import.meta.url)),
		},
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
