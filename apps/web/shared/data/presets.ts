import type { Preset } from "~~/shared/types/template";

export const presets: Preset[] = [
	{
		id: "fullstack-next",
		name: "Next.js Fullstack",
		description: "Complete Next.js app with UI, state, API, auth, and database",
		icon: "mdi:rocket",
		config: {
			ecosystem: "next",
			libraries: ["shadcn", "zustand", "trpc", "next-auth", "prisma"],
			packageManager: "bun",
		},
		tags: ["fullstack", "nextjs", "production"],
	},
	{
		id: "minimal-nuxt",
		name: "Nuxt Minimal",
		description: "Lightweight Nuxt app with essential UI and state management",
		icon: "mdi:leaf",
		config: {
			ecosystem: "nuxt",
			libraries: ["nuxt-ui", "pinia"],
			packageManager: "bun",
		},
		tags: ["minimal", "nuxt", "ssr"],
	},
	{
		id: "bun-api",
		name: "Bun API Server",
		description: "Fast Bun API with Hono and Drizzle ORM",
		icon: "mdi:server",
		config: {
			ecosystem: "bun",
			libraries: ["hono", "drizzle", "lucia"],
			packageManager: "bun",
		},
		tags: ["api", "bun", "backend"],
	},
	{
		id: "flutter-mobile",
		name: "Flutter Mobile App",
		description: "Cross-platform mobile app with state and API",
		icon: "mdi:cellphone",
		config: {
			ecosystem: "flutter",
			libraries: ["material", "riverpod", "dio", "firebase-auth", "sqflite"],
			packageManager: "bun",
		},
		tags: ["mobile", "flutter", "cross-platform"],
	},
	{
		id: "kotlin-desktop",
		name: "Kotlin Desktop",
		description: "Modern Kotlin desktop app with Compose",
		icon: "mdi:monitor",
		config: {
			ecosystem: "kotlin",
			libraries: ["compose", "kotlin-flow", "ktor", "kauth", "exposed"],
			packageManager: "bun",
		},
		tags: ["desktop", "kotlin", "compose"],
	},
	{
		id: "next-ui-only",
		name: "Next.js UI Only",
		description: "Next.js with beautiful UI components",
		icon: "mdi:palette",
		config: {
			ecosystem: "next",
			libraries: ["shadcn", "radix"],
			packageManager: "bun",
		},
		tags: ["ui", "nextjs", "frontend"],
	},
	{
		id: "nuxt-fullstack",
		name: "Nuxt Fullstack",
		description: "Complete Nuxt app with all features",
		icon: "mdi:rocket",
		config: {
			ecosystem: "nuxt",
			libraries: ["nuxt-ui", "pinia", "nuxt-api", "auth-js", "prisma"],
			packageManager: "bun",
		},
		tags: ["fullstack", "nuxt", "production"],
	},
	{
		id: "bun-ssr",
		name: "Bun SSR App",
		description: "Bun with Elysia for SSR",
		icon: "mdi:lightning-bolt",
		config: {
			ecosystem: "bun",
			libraries: ["react", "zustand", "elysia", "lucia", "drizzle"],
			packageManager: "bun",
		},
		tags: ["ssr", "bun", "fast"],
	},
];
