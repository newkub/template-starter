import type { EcosystemConfig, LibraryCategoryConfig } from "../types/template";

export const ecosystems: EcosystemConfig[] = [
	{
		id: "bun",
		name: "Bun",
		description: "Fast JavaScript runtime and bundler",
		icon: "mdi:run-fast",
		libraries: {
			ui: [
				{ id: "react", name: "React", description: "UI library", icon: "mdi:react" },
				{ id: "vue", name: "Vue", description: "Progressive framework", icon: "mdi:vuejs" },
			],
			state: [
				{ id: "zustand", name: "Zustand", description: "State management", icon: "mdi:database" },
				{ id: "pinia", name: "Pinia", description: "Vue state store", icon: "mdi:database-outline" },
			],
			api: [
				{ id: "hono", name: "Hono", description: "Web framework", icon: "mdi:server" },
				{ id: "elysia", name: "Elysia", description: "Fast web framework", icon: "mdi:lightning-bolt" },
			],
			auth: [
				{ id: "lucia", name: "Lucia", description: "Auth library", icon: "mdi:shield-account" },
			],
			db: [
				{ id: "drizzle", name: "Drizzle", description: "SQL ORM", icon: "mdi:database" },
				{ id: "prisma", name: "Prisma", description: "ORM", icon: "mdi:database-cog" },
			],
		},
	},
	{
		id: "next",
		name: "Next.js",
		description: "React framework for production",
		icon: "mdi:react",
		libraries: {
			ui: [
				{ id: "shadcn", name: "shadcn/ui", description: "Component library", icon: "mdi:palette" },
				{ id: "radix", name: "Radix UI", description: "Headless components", icon: "mdi:vector-square" },
			],
			state: [
				{ id: "zustand", name: "Zustand", description: "State management", icon: "mdi:database" },
				{ id: "jotai", name: "Jotai", description: "Atomic state", icon: "mdi:atom" },
			],
			api: [
				{ id: "trpc", name: "tRPC", description: "End-to-end types", icon: "mdi:api" },
				{ id: "next-api", name: "Next API", description: "Built-in API routes", icon: "mdi:server" },
			],
			auth: [
				{ id: "next-auth", name: "NextAuth.js", description: "Auth solution", icon: "mdi:shield-account" },
				{ id: "clerk", name: "Clerk", description: "Auth platform", icon: "mdi:account-key" },
			],
			db: [
				{ id: "prisma", name: "Prisma", description: "ORM", icon: "mdi:database-cog" },
				{ id: "drizzle", name: "Drizzle", description: "SQL ORM", icon: "mdi:database" },
			],
		},
	},
	{
		id: "nuxt",
		name: "Nuxt",
		description: "Intuitive Vue framework",
		icon: "mdi:vuejs",
		libraries: {
			ui: [
				{ id: "nuxt-ui", name: "Nuxt UI", description: "Component library", icon: "mdi:palette" },
				{ id: "radix-vue", name: "Radix Vue", description: "Headless components", icon: "mdi:vector-square" },
			],
			state: [
				{ id: "pinia", name: "Pinia", description: "Vue state store", icon: "mdi:database-outline" },
			],
			api: [
				{ id: "nuxt-api", name: "Nuxt API", description: "Server routes", icon: "mdi:server" },
			],
			auth: [
				{ id: "auth-js", name: "Auth.js", description: "Auth solution", icon: "mdi:shield-account" },
				{ id: "nuxt-auth", name: "Nuxt Auth", description: "Auth module", icon: "mdi:account-key" },
			],
			db: [
				{ id: "prisma", name: "Prisma", description: "ORM", icon: "mdi:database-cog" },
				{ id: "drizzle", name: "Drizzle", description: "SQL ORM", icon: "mdi:database" },
			],
		},
	},
	{
		id: "flutter",
		name: "Flutter",
		description: "Build beautiful apps",
		icon: "mdi:flutter",
		libraries: {
			ui: [
				{ id: "flutter-ui", name: "Material", description: "Material Design", icon: "mdi:palette" },
				{ id: "cupertino", name: "Cupertino", description: "iOS style", icon: "mdi:apple" },
			],
			state: [
				{ id: "riverpod", name: "Riverpod", description: "State management", icon: "mdi:database" },
				{ id: "bloc", name: "BLoC", description: "State pattern", icon: "mdi:cube-outline" },
			],
			api: [
				{ id: "dio", name: "Dio", description: "HTTP client", icon: "mdi:api" },
				{ id: "retrofit", name: "Retrofit", description: "Type-safe API", icon: "mdi:api" },
			],
			auth: [
				{ id: "firebase-auth", name: "Firebase Auth", description: "Auth service", icon: "mdi:shield-account" },
			],
			db: [
				{ id: "sqflite", name: "Sqflite", description: "SQLite database", icon: "mdi:database" },
				{ id: "hive", name: "Hive", description: "NoSQL database", icon: "mdi:database-cog" },
			],
		},
	},
	{
		id: "kotlin",
		name: "Kotlin",
		description: "Modern desktop development",
		icon: "mdi:language-kotlin",
		libraries: {
			ui: [
				{ id: "compose", name: "Compose", description: "Modern UI toolkit", icon: "mdi:palette" },
			],
			state: [
				{ id: "kotlin-flow", name: "Flow", description: "Reactive streams", icon: "mdi:database" },
			],
			api: [
				{ id: "ktor", name: "Ktor", description: "Async framework", icon: "mdi:server" },
			],
			auth: [
				{ id: "kauth", name: "KAuth", description: "Auth library", icon: "mdi:shield-account" },
			],
			db: [
				{ id: "exposed", name: "Exposed", description: "SQL framework", icon: "mdi:database" },
			],
		},
	},
];

export const libraryCategories: LibraryCategoryConfig[] = [
	{ id: "ui", name: "UI", icon: "mdi:palette" },
	{ id: "state", name: "State", icon: "mdi:database" },
	{ id: "api", name: "API", icon: "mdi:api" },
	{ id: "auth", name: "Auth", icon: "mdi:shield-account" },
	{ id: "db", name: "Database", icon: "mdi:database-cog" },
];
