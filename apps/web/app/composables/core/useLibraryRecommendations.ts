import type { Ecosystem, Library, LibraryRecommendation, UseCase } from "#shared/types/template";
import { ecosystemConfigs } from "#shared/data/ecosystems";

export const useLibraryRecommendations = () => {
	const getRecommendationsByUseCase = (
		useCaseId: string,
		ecosystem: Ecosystem,
		selectedLibraries: string[] = [],
	): LibraryRecommendation[] => {
		const useCases = getUseCases();
		const useCase = useCases.find((uc) => uc.id === useCaseId);

		if (!useCase) return [];

		const recommendedLibraryIds = useCase.recommendedLibraries[ecosystem] || [];
		const ecosystemLibraries = getAllLibrariesByEcosystem(ecosystem);

		const recommendations: LibraryRecommendation[] = [];

		for (const libraryId of recommendedLibraryIds) {
			const library = ecosystemLibraries.find((lib) => lib.id === libraryId);
			if (!library) continue;

			if (selectedLibraries.includes(libraryId)) continue;

			const confidence = calculateConfidence(library, selectedLibraries, ecosystem);
			const reason = generateReason(library, useCase, ecosystem);
			const relatedLibraries = findRelatedLibraries(library, ecosystemLibraries, selectedLibraries);

			recommendations.push({
				library,
				reason,
				confidence,
				relatedLibraries,
			});
		}

		return recommendations.sort((a, b) => b.confidence - a.confidence);
	};

	const getSmartRecommendations = (
		ecosystem: Ecosystem,
		selectedLibraries: string[] = [],
	): LibraryRecommendation[] => {
		const ecosystemLibraries = getAllLibrariesByEcosystem(ecosystem);
		const recommendations: LibraryRecommendation[] = [];

		for (const library of ecosystemLibraries) {
			if (selectedLibraries.includes(library.id)) continue;

			const confidence = calculateSmartConfidence(library, selectedLibraries, ecosystem);
			if (confidence < 0.3) continue;

			const reason = generateSmartReason(library, selectedLibraries, ecosystem);
			const relatedLibraries = findRelatedLibraries(library, ecosystemLibraries, selectedLibraries);

			recommendations.push({
				library,
				reason,
				confidence,
				relatedLibraries,
			});
		}

		return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
	};

	const getCompatibilitySuggestions = (
		ecosystem: Ecosystem,
		selectedLibraries: string[],
	): LibraryRecommendation[] => {
		const ecosystemLibraries = getAllLibrariesByEcosystem(ecosystem);
		const suggestions: LibraryRecommendation[] = [];

		for (const selectedId of selectedLibraries) {
			const selectedLibrary = ecosystemLibraries.find((lib) => lib.id === selectedId);
			if (!selectedLibrary?.dependencies) continue;

			for (const depId of selectedLibrary.dependencies) {
				if (selectedLibraries.includes(depId)) continue;

				const depLibrary = ecosystemLibraries.find((lib) => lib.id === depId);
				if (!depLibrary) continue;

				suggestions.push({
					library: depLibrary,
					reason: `Required by ${selectedLibrary.name}`,
					confidence: 0.9,
					relatedLibraries: [],
				});
			}
		}

		return suggestions;
	};

	const getAllLibrariesByEcosystem = (ecosystem: Ecosystem): Library[] => {
		const config = ecosystemConfigs.find((ec) => ec.id === ecosystem);
		if (!config) return [];

		return Object.values(config.libraries).flat();
	};

	return {
		getRecommendationsByUseCase,
		getSmartRecommendations,
		getCompatibilitySuggestions,
		getAllLibrariesByEcosystem,
	};
};

function getUseCases(): UseCase[] {
	return [
		{
			id: "fullstack-web",
			name: "Fullstack Web App",
			description: "Complete web application with frontend and backend",
			icon: "mdi:web",
			recommendedLibraries: {
				next: ["shadcn", "zustand", "trpc", "next-auth", "prisma"],
				nuxt: ["nuxt-ui", "pinia", "nuxt-auth-utils", "drizzle-orm"],
				bun: ["elysia", "drizzle-orm", "zod", "hono"],
				flutter: ["riverpod", "go_router", "dio", "hive"],
				kotlin: ["koin", "ktor-client", "room", "navigation-compose"],
			},
		},
		{
			id: "api-server",
			name: "API Server",
			description: "RESTful or GraphQL API backend",
			icon: "mdi:server",
			recommendedLibraries: {
				next: ["trpc", "zod", "prisma"],
				nuxt: ["nuxt-api-party", "zod", "drizzle-orm"],
				bun: ["hono", "zod", "drizzle-orm", "elysia"],
				flutter: [],
				kotlin: ["ktor", "exposed", "koin"],
			},
		},
		{
			id: "dashboard",
			name: "Dashboard / Admin",
			description: "Admin panel or dashboard with charts and tables",
			icon: "mdi:view-dashboard",
			recommendedLibraries: {
				next: ["shadcn", "zustand", "tanstack-table", "recharts"],
				nuxt: ["nuxt-ui", "pinia", "vue-chartjs", "vuetify"],
				bun: [],
				flutter: ["syncfusion_flutter_charts", "flutter_data_table"],
				kotlin: ["compose-charts", "voyager"],
			},
		},
		{
			id: "ecommerce",
			name: "E-commerce",
			description: "Online store with cart and payments",
			icon: "mdi:cart",
			recommendedLibraries: {
				next: ["shadcn", "zustand", "stripe", "prisma", "next-auth"],
				nuxt: ["nuxt-ui", "pinia", "@stripe/stripe-js", "drizzle-orm"],
				bun: ["hono", "stripe", "drizzle-orm"],
				flutter: ["flutter_stripe", "get", "hive"],
				kotlin: ["stripe-android", "room", "koin"],
			},
		},
		{
			id: "blog",
			name: "Blog / CMS",
			description: "Content management system for blogs",
			icon: "mdi:post",
			recommendedLibraries: {
				next: ["mdx", "gray-matter", "shadcn", "zustand"],
				nuxt: ["@nuxt/content", "nuxt-ui", "pinia"],
				bun: ["hono", "marked"],
				flutter: ["flutter_markdown", "get"],
				kotlin: ["room", "markdown"],
			},
		},
	];
}

function calculateConfidence(
	library: Library,
	selectedLibraries: string[],
	_ecosystem: Ecosystem,
): number {
	let confidence = 0.5;

	if (library.popularity) {
		confidence += library.popularity * 0.3;
	}

	if (library.dependencies) {
		const hasDeps = library.dependencies.some((dep) => selectedLibraries.includes(dep));
		if (hasDeps) confidence += 0.2;
	}

	return Math.min(confidence, 1);
}

function calculateSmartConfidence(
	library: Library,
	selectedLibraries: string[],
	ecosystem: Ecosystem,
): number {
	let confidence = 0.3;

	if (library.popularity) {
		confidence += library.popularity * 0.4;
	}

	if (library.dependencies) {
		const depCount = library.dependencies.filter((dep) => selectedLibraries.includes(dep)).length;
		confidence += depCount * 0.15;
	}

	if (selectedLibraries.length === 0) {
		confidence += 0.2;
	}

	return Math.min(confidence, 1);
}

function generateReason(library: Library, useCase: UseCase, ecosystem: Ecosystem): string {
	return `Perfect for ${useCase.name} in ${ecosystem} ecosystem`;
}

function generateSmartReason(library: Library, selectedLibraries: string[], _ecosystem: Ecosystem): string {
	if (library.popularity && library.popularity > 0.8) {
		return `Highly popular library in ${_ecosystem} ecosystem`;
	}

	if (library.dependencies) {
		const compatibleDeps = library.dependencies.filter((dep) => selectedLibraries.includes(dep));
		if (compatibleDeps.length > 0) {
			return `Compatible with your selected libraries`;
		}
	}

	return `Recommended for ${_ecosystem} projects`;
}

function findRelatedLibraries(
	library: Library,
	allLibraries: Library[],
	selectedLibraries: string[],
): string[] {
	if (!library.dependencies) return [];

	return library.dependencies.filter((dep) => !selectedLibraries.includes(dep));
}
