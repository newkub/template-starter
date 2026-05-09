import type { DependencyConflict, Ecosystem, Library, TemplateConfig } from "#shared/types/template";
import { ecosystems } from "#shared/data/ecosystems";

export const useDependencyConflictDetection = () => {
	const detectConflicts = (config: TemplateConfig): DependencyConflict[] => {
		const conflicts: DependencyConflict[] = [];
		const ecosystemLibraries = getAllLibrariesByEcosystem(config.ecosystem);

		const selectedLibraries = config.libraries
			.map((id) => ecosystemLibraries.find((lib) => lib.id === id))
			.filter((lib): lib is Library => lib !== undefined);

		for (let i = 0; i < selectedLibraries.length; i++) {
			for (let j = i + 1; j < selectedLibraries.length; j++) {
				const lib1 = selectedLibraries[i];
				const lib2 = selectedLibraries[j];

				if (!lib1 || !lib2) continue;

				const conflict = checkLibraryConflict(lib1, lib2, config.ecosystem);
				if (conflict) {
					conflicts.push(conflict);
				}
			}
		}

		const missingDependencies = checkMissingDependencies(selectedLibraries, ecosystemLibraries);
		conflicts.push(...missingDependencies);

		const versionConflicts = checkVersionConflicts(selectedLibraries);
		conflicts.push(...versionConflicts);

		return conflicts;
	};

	const getSeverityLevel = (conflicts: DependencyConflict[]): "error" | "warning" | "info" => {
		const hasErrors = conflicts.some((c) => c.severity === "error");
		const hasWarnings = conflicts.some((c) => c.severity === "warning");

		if (hasErrors) return "error";
		if (hasWarnings) return "warning";
		return "info";
	};

	const getConflictSummary = (conflicts: DependencyConflict[]) => {
		const errors = conflicts.filter((c) => c.severity === "error");
		const warnings = conflicts.filter((c) => c.severity === "warning");
		const info = conflicts.filter((c) => c.severity === "info");

		return {
			total: conflicts.length,
			errors: errors.length,
			warnings: warnings.length,
			info: info.length,
		};
	};

	const getSuggestions = (conflicts: DependencyConflict[]): string[] => {
		const suggestions: string[] = [];

		for (const conflict of conflicts) {
			if (conflict.resolution) {
				suggestions.push(conflict.resolution);
			}

			if (conflict.severity === "error") {
				suggestions.push(`Consider removing either ${conflict.library1} or ${conflict.library2}`);
			}

			if (conflict.alternatives && conflict.alternatives.length > 0) {
				suggestions.push(`Alternatives: ${conflict.alternatives.join(", ")}`);
			}
		}

		return [...new Set(suggestions)];
	};

	function getAllLibrariesByEcosystem(ecosystem: Ecosystem): Library[] {
		const config = ecosystems.find((ec: { id: Ecosystem }) => ec.id === ecosystem);
		if (!config) return [];

		return Object.values(config.libraries).flat() as Library[];
	}

	function checkLibraryConflict(
		lib1: Library,
		lib2: Library,
		_ecosystem: Ecosystem,
	): DependencyConflict | null {
		const knownConflicts = getKnownConflicts();

		for (const conflict of knownConflicts) {
			if (
				(conflict.lib1 === lib1.id && conflict.lib2 === lib2.id) ||
				(conflict.lib1 === lib2.id && conflict.lib2 === lib1.id)
			) {
				return {
					library1: lib1.id,
					library2: lib2.id,
					severity: conflict.severity,
					message: conflict.message,
					resolution: conflict.resolution,
					alternatives: conflict.alternatives,
				};
			}
		}

		if (lib1.dependencies && lib1.dependencies.includes(lib2.id)) {
			return {
				library1: lib1.id,
				library2: lib2.id,
				severity: "info",
				message: `${lib1.name} depends on ${lib2.name}`,
				resolution: "This is expected and safe to use together",
			};
		}

		if (lib2.dependencies && lib2.dependencies.includes(lib1.id)) {
			return {
				library1: lib1.id,
				library2: lib2.id,
				severity: "info",
				message: `${lib2.name} depends on ${lib1.name}`,
				resolution: "This is expected and safe to use together",
			};
		}

		return null;
	}

	function checkMissingDependencies(
		selectedLibraries: Library[],
		allLibraries: Library[],
	): DependencyConflict[] {
		const conflicts: DependencyConflict[] = [];

		for (const lib of selectedLibraries) {
			if (!lib.dependencies) continue;

			for (const depId of lib.dependencies) {
				const hasDep = selectedLibraries.some((l) => l.id === depId);
				if (!hasDep) {
					const depLibrary = allLibraries.find((l) => l.id === depId);
					if (depLibrary) {
						conflicts.push({
							library1: lib.id,
							library2: depId,
							severity: "warning",
							message: `${lib.name} requires ${depLibrary.name} but it's not selected`,
							resolution: `Consider adding ${depLibrary.name} to your template`,
						});
					}
				}
			}
		}

		return conflicts;
	}

	function checkVersionConflicts(selectedLibraries: Library[]): DependencyConflict[] {
		const conflicts: DependencyConflict[] = [];

		const peerDependencyConflicts: Record<string, string[]> = {
			"next-auth": ["next"],
			"@nuxt/auth": ["nuxt"],
			"react-query": ["react"],
			"@tanstack/react-query": ["react"],
		};

		for (const lib of selectedLibraries) {
			const requiredFrameworks = peerDependencyConflicts[lib.id];
			if (!requiredFrameworks) continue;

			const hasFramework = requiredFrameworks.some((fw) =>
				selectedLibraries.some((l) => l.id === fw),
			);

			if (!hasFramework) {
				const framework = requiredFrameworks[0];
				if (!framework) continue;

				conflicts.push({
					library1: lib.id,
					library2: framework,
					severity: "error",
					message: `${lib.name} requires ${requiredFrameworks.join(" or ")} but none are selected`,
					resolution: `Add ${framework} to your template`,
				});
			}
		}

		return conflicts;
	}

	function getKnownConflicts() {
		return [
			{
				lib1: "zustand",
				lib2: "redux",
				severity: "error" as const,
				message: "Zustand and Redux are both state management libraries and should not be used together",
				resolution: "Choose one state management solution",
				alternatives: ["zustand", "redux", "jotai", "recoil"],
			},
			{
				lib1: "pinia",
				lib2: "vuex",
				severity: "error" as const,
				message: "Pinia and Vuex are both state management libraries for Vue and should not be used together",
				resolution: "Choose Pinia (recommended) or Vuex",
				alternatives: ["pinia", "vuex"],
			},
			{
				lib1: "trpc",
				lib2: "graphql",
				severity: "warning" as const,
				message: "tRPC and GraphQL serve similar purposes. Using both may add unnecessary complexity",
				resolution: "Choose one API layer approach",
				alternatives: ["trpc", "graphql", "rest"],
			},
			{
				lib1: "prisma",
				lib2: "typeorm",
				severity: "warning" as const,
				message: "Prisma and TypeORM are both ORMs. Using both may cause conflicts",
				resolution: "Choose one ORM",
				alternatives: ["prisma", "typeorm", "drizzle-orm", "mikro-orm"],
			},
			{
				lib1: "prisma",
				lib2: "drizzle-orm",
				severity: "warning" as const,
				message: "Prisma and Drizzle ORM are both database tools. Using both is not recommended",
				resolution: "Choose one database solution",
				alternatives: ["prisma", "drizzle-orm", "typeorm"],
			},
			{
				lib1: "shadcn",
				lib2: "chakra-ui",
				severity: "warning" as const,
				message: "shadcn/ui and Chakra UI are both UI libraries. Using both may cause style conflicts",
				resolution: "Choose one UI library",
				alternatives: ["shadcn", "chakra-ui", "mui", "ant-design"],
			},
			{
				lib1: "nuxt-ui",
				lib2: "vuetify",
				severity: "warning" as const,
				message: "Nuxt UI and Vuetify are both UI libraries for Nuxt. Using both may cause conflicts",
				resolution: "Choose one UI library",
				alternatives: ["nuxt-ui", "vuetify", "element-plus"],
			},
			{
				lib1: "react-query",
				lib2: "swr",
				severity: "warning" as const,
				message: "React Query and SWR are both data fetching libraries. Using both is redundant",
				resolution: "Choose one data fetching solution",
				alternatives: ["react-query", "swr", "@tanstack/react-query"],
			},
		];
	}

	return {
		detectConflicts,
		getSeverityLevel,
		getConflictSummary,
		getSuggestions,
	};
};
