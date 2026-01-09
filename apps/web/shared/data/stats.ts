import type { LibraryStats, EcosystemStats } from "~~/shared/types/template";

export const libraryStats: LibraryStats[] = [
	{ id: "shadcn", name: "shadcn/ui", usageCount: 1250, trend: "up" },
	{ id: "nuxt-ui", name: "Nuxt UI", usageCount: 980, trend: "up" },
	{ id: "pinia", name: "Pinia", usageCount: 850, trend: "stable" },
	{ id: "zustand", name: "Zustand", usageCount: 720, trend: "up" },
	{ id: "prisma", name: "Prisma", usageCount: 1100, trend: "stable" },
	{ id: "drizzle", name: "Drizzle", usageCount: 650, trend: "up" },
	{ id: "hono", name: "Hono", usageCount: 580, trend: "up" },
	{ id: "trpc", name: "tRPC", usageCount: 890, trend: "stable" },
	{ id: "next-auth", name: "NextAuth.js", usageCount: 920, trend: "stable" },
	{ id: "riverpod", name: "Riverpod", usageCount: 450, trend: "up" },
	{ id: "dio", name: "Dio", usageCount: 380, trend: "stable" },
	{ id: "compose", name: "Compose", usageCount: 320, trend: "up" },
];

export const ecosystemStats: EcosystemStats[] = [
	{
		id: "next",
		name: "Next.js",
		usageCount: 2450,
		popularLibraries: [
			{ id: "shadcn", name: "shadcn/ui", usageCount: 1250, trend: "up" },
			{ id: "zustand", name: "Zustand", usageCount: 720, trend: "up" },
			{ id: "trpc", name: "tRPC", usageCount: 890, trend: "stable" },
			{ id: "next-auth", name: "NextAuth.js", usageCount: 920, trend: "stable" },
			{ id: "prisma", name: "Prisma", usageCount: 1100, trend: "stable" },
		],
	},
	{
		id: "nuxt",
		name: "Nuxt",
		usageCount: 1680,
		popularLibraries: [
			{ id: "nuxt-ui", name: "Nuxt UI", usageCount: 980, trend: "up" },
			{ id: "pinia", name: "Pinia", usageCount: 850, trend: "stable" },
			{ id: "auth-js", name: "Auth.js", usageCount: 620, trend: "stable" },
			{ id: "prisma", name: "Prisma", usageCount: 780, trend: "stable" },
		],
	},
	{
		id: "bun",
		name: "Bun",
		usageCount: 920,
		popularLibraries: [
			{ id: "hono", name: "Hono", usageCount: 580, trend: "up" },
			{ id: "drizzle", name: "Drizzle", usageCount: 650, trend: "up" },
			{ id: "lucia", name: "Lucia", usageCount: 420, trend: "up" },
		],
	},
	{
		id: "flutter",
		name: "Flutter",
		usageCount: 750,
		popularLibraries: [
			{ id: "riverpod", name: "Riverpod", usageCount: 450, trend: "up" },
			{ id: "dio", name: "Dio", usageCount: 380, trend: "stable" },
			{ id: "firebase-auth", name: "Firebase Auth", usageCount: 320, trend: "stable" },
		],
	},
	{
		id: "kotlin",
		name: "Kotlin",
		usageCount: 380,
		popularLibraries: [
			{ id: "compose", name: "Compose", usageCount: 320, trend: "up" },
			{ id: "ktor", name: "Ktor", usageCount: 280, trend: "stable" },
			{ id: "exposed", name: "Exposed", usageCount: 240, trend: "up" },
		],
	},
];
