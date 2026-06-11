import type { DetectionConfig, DetectionResult } from "../types/index.js";

// @ts-expect-error
const cwd = () => typeof process !== "undefined" ? process.cwd() : ".";
// @ts-expect-error
const homedir = () => typeof process !== "undefined" ? process.env.HOME || process.env.USERPROFILE || "." : ".";

const fileExists = (path: string): boolean => {
	try {
		// @ts-expect-error
		Bun.file(path);
		return true;
	} catch {
		return false;
	}
};

const readFile = (path: string): string | null => {
	try {
		// @ts-expect-error
		return Bun.file(path).text();
	} catch {
		return null;
	}
};

const join = (...parts: string[]): string => {
	return parts.join("/").replace(/\/+/g, "/");
};

export class DetectionService {
	private priority: string[] = ["cli", "env", "local", "git", "context", "user", "global"];

	async detect(options: DetectionConfig = {}): Promise<DetectionResult> {
		const results: DetectionResult[] = [];

		// CLI args (highest priority)
		const cliResult = this.detectFromCli(options);
		if (cliResult) results.push(cliResult);

		// Environment variables
		const envResult = await this.detectFromEnv();
		if (envResult) results.push(envResult);

		// Local config file
		const localResult = await this.detectFromLocalConfig();
		if (localResult) results.push(localResult);

		// Git history
		const gitResult = await this.detectFromGit();
		if (gitResult) results.push(gitResult);

		// Current directory context
		const contextResult = await this.detectFromContext();
		if (contextResult) results.push(contextResult);

		// User preferences
		const userResult = await this.detectFromUserConfig();
		if (userResult) results.push(userResult);

		// Global defaults
		const globalResult = this.detectFromGlobal();
		if (globalResult) results.push(globalResult);

		// Merge by priority
		return this.mergeByPriority(results);
	}

	private detectFromCli(options: DetectionConfig): DetectionResult | null {
		const config: DetectionConfig = {};
		let hasValue = false;

		if (options.framework) {
			config.framework = options.framework;
			hasValue = true;
		}
		if (options.database) {
			config.database = options.database;
			hasValue = true;
		}
		if (options.auth) {
			config.auth = options.auth;
			hasValue = true;
		}
		if (options.deployment) {
			config.deployment = options.deployment;
			hasValue = true;
		}
		if (options.features && options.features.length > 0) {
			config.features = options.features;
			hasValue = true;
		}

		return hasValue
			? { source: "cli", config, confidence: 1.0 }
			: null;
	}

	private async detectFromEnv(): Promise<DetectionResult | null> {
		const config: DetectionConfig = {};
		let hasValue = false;

		// @ts-expect-error
		if (process.env.TEMPLATES_FRAMEWORK) {
			// @ts-expect-error
			config.framework = process.env.TEMPLATES_FRAMEWORK;
			hasValue = true;
		}
		// @ts-expect-error
		if (process.env.TEMPLATES_DATABASE) {
			// @ts-expect-error
			config.database = process.env.TEMPLATES_DATABASE;
			hasValue = true;
		}
		// @ts-expect-error
		if (process.env.TEMPLATES_AUTH) {
			// @ts-expect-error
			config.auth = process.env.TEMPLATES_AUTH;
			hasValue = true;
		}
		// @ts-expect-error
		if (process.env.TEMPLATES_DEPLOYMENT) {
			// @ts-expect-error
			config.deployment = process.env.TEMPLATES_DEPLOYMENT;
			hasValue = true;
		}
		// @ts-expect-error
		if (process.env.TEMPLATES_FEATURES) {
			// @ts-expect-error
			config.features = process.env.TEMPLATES_FEATURES.split(",");
			hasValue = true;
		}

		return hasValue
			? { source: "env", config, confidence: 0.9 }
			: null;
	}

	private async detectFromLocalConfig(): Promise<DetectionResult | null> {
		const localConfigPath = join(cwd(), ".templates", "config.json");
		if (!fileExists(localConfigPath)) return null;

		try {
			const content = readFile(localConfigPath);
			if (!content) return null;
			const config = JSON.parse(content) as DetectionConfig;
			return { source: "local", config, confidence: 0.85 };
		} catch {
			return null;
		}
	}

	private async detectFromGit(): Promise<DetectionResult | null> {
		// Git detection disabled - requires child_process
		// TODO: Implement using Bun's native APIs
		return null;
	}

	private async detectFromContext(): Promise<DetectionResult | null> {
		const config: DetectionConfig = {};
		let hasValue = false;

		// Detect from package.json
		const packageJsonPath = join(cwd(), "package.json");
		if (fileExists(packageJsonPath)) {
			try {
				const content = readFile(packageJsonPath);
				if (content) {
					const pkg = JSON.parse(content);

					// Detect framework from dependencies
					const deps = { ...pkg.dependencies, ...pkg.devDependencies };

					if (deps.next) {
						config.framework = "next";
						hasValue = true;
					} else if (deps.nuxt) {
						config.framework = "nuxt";
						hasValue = true;
					} else if (deps["@solidjs/start"]) {
						config.framework = "solidstart";
						hasValue = true;
					} else if (deps["@sveltejs/kit"]) {
						config.framework = "sveltekit";
						hasValue = true;
					} else if (deps.vite && deps.react) {
						config.framework = "vite-react";
						hasValue = true;
					}
				}
			} catch {
				// Ignore parse errors
			}
		}

		// Detect from docker-compose.yml
		const dockerComposePath = join(cwd(), "docker-compose.yml");
		if (fileExists(dockerComposePath)) {
			try {
				const content = readFile(dockerComposePath);
				if (content) {
					if (content.includes("postgres") || content.includes("postgresql")) {
						config.database = "postgres";
						hasValue = true;
					} else if (content.includes("mysql")) {
						config.database = "mysql";
						hasValue = true;
					} else if (content.includes("mongo") || content.includes("mongodb")) {
						config.database = "mongodb";
						hasValue = true;
					} else if (content.includes("redis")) {
						config.database = "redis";
						hasValue = true;
					}
				}
			} catch {
				// Ignore parse errors
			}
		}

		return hasValue
			? { source: "context", config, confidence: 0.75 }
			: null;
	}

	private async detectFromUserConfig(): Promise<DetectionResult | null> {
		const userConfigPath = join(homedir(), ".templates", "config.json");
		if (!fileExists(userConfigPath)) return null;

		try {
			const content = readFile(userConfigPath);
			if (!content) return null;
			const parsed = JSON.parse(content);
			const config = parsed.defaults as DetectionConfig;

			if (config && Object.keys(config).length > 0) {
				return { source: "user", config, confidence: 0.6 };
			}
			return null;
		} catch {
			return null;
		}
	}

	private detectFromGlobal(): DetectionResult | null {
		// Global defaults
		const config: DetectionConfig = {
			framework: "next",
			features: ["typescript", "tailwind"],
		};
		return { source: "global", config, confidence: 0.5 };
	}

	private mergeByPriority(results: DetectionResult[]): DetectionResult {
		const merged: DetectionConfig = {};
		const sources: string[] = [];

		for (const source of this.priority) {
			const result = results.find((r) => r.source === source);
			if (result) {
				Object.assign(merged, result.config);
				sources.push(result.source);
			}
		}

		// Calculate confidence based on highest priority source
		const highestResult = results.find((r) => r.source === sources[0]);
		const confidence = highestResult?.confidence ?? 0.5;

		return { source: sources[0] as "cli" | "env" | "local" | "git" | "context" | "user" | "global", config: merged, confidence };
	}
}
