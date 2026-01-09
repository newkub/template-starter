import type { CompatibilityIssue, TemplateConfig, LibraryCategory } from "../../../shared/types/template";
import { ecosystems } from "../../../shared/data/ecosystems";

const compatibilityRules: Record<string, CompatibilityIssue[]> = {
	conflicts: [
		{
			type: "conflict",
			message: "Multiple state management libraries may cause conflicts",
			libraries: ["zustand", "pinia", "jotai", "riverpod", "bloc", "kotlin-flow"],
			alternatives: ["Choose one state management library"],
		},
		{
			type: "conflict",
			message: "Multiple ORM libraries should not be used together",
			libraries: ["drizzle", "prisma", "exposed", "sqflite", "hive"],
			alternatives: ["Choose one database library"],
		},
	],
	warnings: [
		{
			type: "warning",
			message: "Authentication library not selected",
			libraries: [],
		},
		{
			type: "warning",
			message: "Database library not selected",
			libraries: [],
		},
	],
};

export function useCompatibility() {
	const checkCompatibility = (config: TemplateConfig): CompatibilityIssue[] => {
		const issues: CompatibilityIssue[] = [];

		const ecosystem = ecosystems.find((e) => e.id === config.ecosystem);
		if (!ecosystem) return issues;

		const selectedLibs = new Set(config.libraries);

		const conflictRules = compatibilityRules.conflicts || [];
		conflictRules.forEach((rule) => {
			const conflictingLibs = rule.libraries.filter((lib) => selectedLibs.has(lib));

			if (conflictingLibs.length > 1) {
				issues.push({
					...rule,
					libraries: conflictingLibs,
				});
			}
		});

		const hasAuth = hasLibraryInCategory(config, ecosystem, "auth");
		const hasDb = hasLibraryInCategory(config, ecosystem, "db");

		if (!hasAuth) {
			issues.push({
				type: "warning",
				message: "Consider adding an authentication library",
				libraries: [],
			});
		}

		if (!hasDb) {
			issues.push({
				type: "warning",
				message: "Consider adding a database library",
				libraries: [],
			});
		}

		const suggestions = generateSuggestions(config, ecosystem);
		issues.push(...suggestions);

		return issues;
	};

	const hasLibraryInCategory = (config: TemplateConfig, ecosystem: any, category: LibraryCategory): boolean => {
		const categoryLibs = ecosystem.libraries[category] || [];
		return categoryLibs.some((lib: any) => config.libraries.includes(lib.id));
	};

	const generateSuggestions = (config: TemplateConfig, ecosystem: any): CompatibilityIssue[] => {
		const suggestions: CompatibilityIssue[] = [];

		if (config.libraries.length === 0) {
			suggestions.push({
				type: "suggestion",
				message: "Start by selecting UI libraries",
				libraries: [],
				alternatives: ecosystem.libraries.ui.map((lib: any) => lib.name),
			});
		}

		const hasUi = hasLibraryInCategory(config, ecosystem, "ui");
		const hasState = hasLibraryInCategory(config, ecosystem, "state");

		if (hasUi && !hasState) {
			suggestions.push({
				type: "suggestion",
				message: "Consider adding state management for better data handling",
				libraries: [],
				alternatives: ecosystem.libraries.state.map((lib: any) => lib.name),
			});
		}

		return suggestions;
	};

	const getSeverity = (issues: CompatibilityIssue[]): "error" | "warning" | "info" => {
		const hasConflicts = issues.some((i) => i.type === "conflict");
		const hasWarnings = issues.some((i) => i.type === "warning");

		if (hasConflicts) return "error";
		if (hasWarnings) return "warning";
		return "info";
	};

	const isCompatible = (issues: CompatibilityIssue[]): boolean => {
		return !issues.some((i) => i.type === "conflict");
	};

	return {
		checkCompatibility,
		getSeverity,
		isCompatible,
	};
}
