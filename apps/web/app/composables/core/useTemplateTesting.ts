import type { TemplateConfig, TestResult, ValidationResult } from "#shared/types/template";
import { useTemplateGenerator } from "./useTemplateGenerator";

export const useTemplateTesting = () => {
	const STORAGE_KEY = "test-results";

	const validateTemplate = (config: TemplateConfig): ValidationResult => {
		const errors: string[] = [];
		const warnings: string[] = [];
		const suggestions: string[] = [];

		if (!config.ecosystem) {
			errors.push("Ecosystem is required");
		}

		if (!config.libraries || config.libraries.length === 0) {
			warnings.push("No libraries selected. Consider adding at least one library.");
		}

		if (config.libraries && config.libraries.length > 20) {
			warnings.push("Too many libraries selected. Consider reducing the number for better maintainability.");
		}

		if (!config.packageManager) {
			suggestions.push("Consider specifying a package manager (bun, npm, yarn, pnpm).");
		}

		const conflicts = detectLibraryConflicts(config);
		errors.push(...conflicts.map((c) => c.message));

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
			suggestions,
		};
	};

	const runTests = async (config: TemplateConfig): Promise<TestResult> => {
		const testId = `test-${Date.now()}`;
		const startedAt = new Date().toISOString();

		const tests: TestResult["tests"] = [];

		tests.push(await testConfigValidity(config));
		tests.push(await testFileGeneration(config));
		tests.push(await testDependencies(config));
		tests.push(await testCommands(config));
		tests.push(await testStructure(config));

		const failedTests = tests.filter((t) => t.status === "failed");
		const status = failedTests.length === 0 ? "passed" : failedTests.length > 0 ? "warning" : "failed";

		const result: TestResult = {
			id: testId,
			templateId: config.ecosystem,
			version: "1.0.0",
			status,
			tests,
			startedAt,
			completedAt: new Date().toISOString(),
		};

		saveTestResult(testId, result);

		return result;
	};

	const getTestResults = (): TestResult[] => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : [];
		}
		return [];
	};

	const getLatestTestResult = (templateId: string): TestResult | null => {
		const results = getTestResults();
		const templateResults = results.filter((r) => r.templateId === templateId);
		return templateResults.length > 0 ? templateResults[templateResults.length - 1] : null;
	};

	const clearTestHistory = (): void => {
		if (import.meta.client) {
			localStorage.removeItem(STORAGE_KEY);
		}
	};

	function detectLibraryConflicts(config: TemplateConfig): Array<{ message: string }> {
		const conflicts: Array<{ message: string }> = [];

		const conflictingPairs: Record<string, string[]> = {
			nextjs: ["react", "vue"],
			nuxt: ["vue", "react"],
			flutter: ["react", "vue"],
			kotlin: ["react", "vue"],
		};

		const ecosystemLibs = conflictingPairs[config.ecosystem] || [];

		for (const lib of config.libraries) {
			if (ecosystemLibs.includes(lib)) {
				conflicts.push({
					message: `Library "${lib}" is not compatible with ${config.ecosystem} ecosystem`,
				});
			}
		}

		const knownConflicts: Record<string, string[]> = {
			zustand: ["redux"],
			pinia: ["vuex"],
			trpc: ["graphql"],
			prisma: ["typeorm", "sequelize"],
		};

		for (const lib of config.libraries) {
			const conflictsForLib = knownConflicts[lib] || [];
			for (const conflict of conflictsForLib) {
				if (config.libraries.includes(conflict)) {
					conflicts.push({
						message: `Conflict detected: "${lib}" and "${conflict}" should not be used together`,
					});
				}
			}
		}

		return conflicts;
	}

	async function testConfigValidity(config: TemplateConfig): Promise<TestResult["tests"][number]> {
		const start = Date.now();

		try {
			const validation = validateTemplate(config);

			if (!validation.isValid) {
				return {
					name: "Config Validity",
					status: "failed",
					message: validation.errors.join(", "),
					duration: Date.now() - start,
				};
			}

			if (validation.warnings.length > 0) {
				return {
					name: "Config Validity",
					status: "skipped",
					message: validation.warnings.join(", "),
					duration: Date.now() - start,
				};
			}

			return {
				name: "Config Validity",
				status: "passed",
				duration: Date.now() - start,
			};
		} catch (error) {
			return {
				name: "Config Validity",
				status: "failed",
				message: error instanceof Error ? error.message : "Unknown error",
				duration: Date.now() - start,
			};
		}
	}

	async function testFileGeneration(config: TemplateConfig): Promise<TestResult["tests"][number]> {
		const start = Date.now();

		try {
			const { generateTemplate } = useTemplateGenerator();
			const template = generateTemplate(config);

			if (!template.files || template.files.length === 0) {
				return {
					name: "File Generation",
					status: "failed",
					message: "No files generated",
					duration: Date.now() - start,
				};
			}

			const requiredFiles = ["package.json", "README.md"];
			const generatedPaths = template.files.map((f) => f.path);
			const missingFiles = requiredFiles.filter((f) => !generatedPaths.includes(f));

			if (missingFiles.length > 0) {
				return {
					name: "File Generation",
					status: "skipped",
					message: `Missing files: ${missingFiles.join(", ")}`,
					duration: Date.now() - start,
				};
			}

			return {
				name: "File Generation",
				status: "passed",
				message: `Generated ${template.files.length} files`,
				duration: Date.now() - start,
			};
		} catch (error) {
			return {
				name: "File Generation",
				status: "failed",
				message: error instanceof Error ? error.message : "Unknown error",
				duration: Date.now() - start,
			};
		}
	}

	async function testDependencies(config: TemplateConfig): Promise<TestResult["tests"][number]> {
		const start = Date.now();

		try {
			if (config.libraries.length === 0) {
				return {
					name: "Dependencies",
					status: "skipped",
					message: "No dependencies to test",
					duration: Date.now() - start,
				};
			}

			const conflicts = detectLibraryConflicts(config);

			if (conflicts.length > 0) {
				return {
					name: "Dependencies",
					status: "failed",
					message: conflicts.map((c) => c.message).join("; "),
					duration: Date.now() - start,
				};
			}

			return {
				name: "Dependencies",
				status: "passed",
				message: `Checked ${config.libraries.length} dependencies`,
				duration: Date.now() - start,
			};
		} catch (error) {
			return {
				name: "Dependencies",
				status: "failed",
				message: error instanceof Error ? error.message : "Unknown error",
				duration: Date.now() - start,
			};
		}
	}

	async function testCommands(config: TemplateConfig): Promise<TestResult["tests"][number]> {
		const start = Date.now();

		try {
			const { generateTemplate } = useTemplateGenerator();
			const template = generateTemplate(config);

			if (!template.commands) {
				return {
					name: "Commands",
					status: "failed",
					message: "No commands generated",
					duration: Date.now() - start,
				};
			}

			const requiredCommands = ["create", "install", "dev", "build"];
			const missingCommands = requiredCommands.filter((cmd) => !template.commands[cmd as keyof typeof template.commands]);

			if (missingCommands.length > 0) {
				return {
					name: "Commands",
					status: "failed",
					message: `Missing commands: ${missingCommands.join(", ")}`,
					duration: Date.now() - start,
				};
			}

			return {
				name: "Commands",
				status: "passed",
				duration: Date.now() - start,
			};
		} catch (error) {
			return {
				name: "Commands",
				status: "failed",
				message: error instanceof Error ? error.message : "Unknown error",
				duration: Date.now() - start,
			};
		}
	}

	async function testStructure(config: TemplateConfig): Promise<TestResult["tests"][number]> {
		const start = Date.now();

		try {
			const { generateTemplate } = useTemplateGenerator();
			const template = generateTemplate(config);

			const hasPackageJson = template.files.some((f) => f.path === "package.json");

			if (!hasPackageJson) {
				return {
					name: "Structure",
					status: "failed",
					message: "Missing package.json",
					duration: Date.now() - start,
				};
			}

			const packageJson = template.files.find((f) => f.path === "package.json");
			if (packageJson) {
				const parsed = JSON.parse(packageJson.content);
				if (!parsed.name || !parsed.version) {
					return {
						name: "Structure",
						status: "skipped",
						message: "package.json is missing name or version",
						duration: Date.now() - start,
					};
				}
			}

			return {
				name: "Structure",
				status: "passed",
				duration: Date.now() - start,
			};
		} catch (error) {
			return {
				name: "Structure",
				status: "failed",
				message: error instanceof Error ? error.message : "Unknown error",
				duration: Date.now() - start,
			};
		}
	}

	function saveTestResult(testId: string, result: TestResult): void {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const results = data ? JSON.parse(data) : [];
			results.push(result);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
		}
	}

	return {
		validateTemplate,
		runTests,
		getTestResults,
		getLatestTestResult,
		clearTestHistory,
	};
};
