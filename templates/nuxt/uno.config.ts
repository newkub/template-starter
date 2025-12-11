import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerVariantGroup,
	presetWebFonts,
	transformerCompileClass,
} from "unocss";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: { 
			  reset: true, 
			} 
		  }),
		presetIcons({
			collections: {
				mdi: () =>
					import("@iconify-json/mdi/icons.json").then((i) => i.default),
			},
		}),
		presetWebFonts({
			provider: "none",
			fonts: {
				sans: "Noto Sans Thai",
				mono: "Fira Code",
			},
			processors: createLocalFontProcessor({
				cacheDir: "node_modules/.cache/unocss/fonts",
				fontAssetsDir: "public/assets/fonts",
				fontServeBaseUrl: "/assets/fonts",
			}),
		}),
	],
	transformers: [transformerVariantGroup(), transformerCompileClass()],
	theme: {
		colors: {
			background: "hsl(var(--background))",
			"background-block": "hsl(var(--background-block))",
			text: "hsl(var(--text))",
			brand: {
				brand: "hsl(var(--brand))",
				error: "hsl(var(--brand-error))",
				warning: "hsl(var(--brand-warning))",
				success: "hsl(var(--brand-success))",
			},
		},
		borderRadius: {
			sm: "var(--rounded-sm)",
			DEFAULT: "var(--rounded)",
			lg: "var(--rounded-lg)",
		},
		spacing: {
			sm: "var(--spacing-sm)",
			DEFAULT: "var(--spacing)",
			lg: "var(--spacing-lg)",
		},
		breakpoints: {
			sm: "320px",
			md: "640px",
			lg: "768px",
			xl: "1024px",
			"2xl": "1280px",
		},
	},
	shortcuts: [],
});
