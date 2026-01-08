import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				theme: true,
			},
		}),
		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
			collections: {
				mdi: async () => (await import("@iconify-json/mdi/icons.json")).default,
			},
		}),
	],
	transformers: [transformerVariantGroup(), transformerDirectives()],
});
