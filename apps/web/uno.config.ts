import {
	defineConfig,
	presetWind4,
	transformerVariantGroup,
	transformerCompileClass,
} from "unocss";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
			  reset: true,
			}
		  }),
	],
	transformers: [transformerVariantGroup(), transformerCompileClass()],
	theme: {
		colors: {
			background: "hsl(var(--background))",
			"background-block": "hsl(var(--background-block))",
			foreground: "hsl(var(--foreground))",
			card: {
				DEFAULT: "hsl(var(--card))",
				foreground: "hsl(var(--card-foreground))",
			},
			popover: {
				DEFAULT: "hsl(var(--popover))",
				foreground: "hsl(var(--popover-foreground))",
			},
			primary: {
				DEFAULT: "hsl(var(--primary))",
				foreground: "hsl(var(--primary-foreground))",
			},
			secondary: {
				DEFAULT: "hsl(var(--secondary))",
				foreground: "hsl(var(--secondary-foreground))",
			},
			muted: {
				DEFAULT: "hsl(var(--muted))",
				foreground: "hsl(var(--muted-foreground))",
			},
			accent: {
				DEFAULT: "hsl(var(--accent))",
				foreground: "hsl(var(--accent-foreground))",
			},
			destructive: {
				DEFAULT: "hsl(var(--destructive))",
				foreground: "hsl(var(--destructive-foreground))",
			},
			border: "hsl(var(--border))",
			input: "hsl(var(--input))",
			ring: "hsl(var(--ring))",
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
