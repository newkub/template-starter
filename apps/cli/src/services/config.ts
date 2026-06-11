import type { ConfigFile, DetectionConfig } from "../types/index.js";

// @ts-expect-error
const homedir = () => typeof process !== "undefined" ? process.env.HOME || process.env.USERPROFILE || "." : ".";
// @ts-expect-error
const cwd = () => typeof process !== "undefined" ? process.cwd() : ".";

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

const writeFile = (path: string, content: string): void => {
	// @ts-expect-error
	Bun.write(path, content);
};

const join = (...parts: string[]): string => {
	return parts.join("/").replace(/\/+/g, "/");
};

export class ConfigService {
	private userConfigPath: string;
	private localConfigPath: string;

	constructor () {
		this.userConfigPath = join(homedir(), ".templates", "config.json");
		this.localConfigPath = join(cwd(), ".templates", "config.json");
	}

	async getUserConfig(): Promise<ConfigFile> {
		if (!fileExists(this.userConfigPath)) {
			return this.getDefaultConfig();
		}

		try {
			const content = readFile(this.userConfigPath);
			if (!content) return this.getDefaultConfig();
			return JSON.parse(content) as ConfigFile;
		} catch {
			return this.getDefaultConfig();
		}
	}

	async getLocalConfig(): Promise<ConfigFile> {
		if (!fileExists(this.localConfigPath)) {
			return {};
		}

		try {
			const content = readFile(this.localConfigPath);
			if (!content) return {};
			return JSON.parse(content) as ConfigFile;
		} catch {
			return {};
		}
	}

	async setUserConfig(config: ConfigFile): Promise<void> {
		const _dir = join(homedir(), ".templates");
		writeFile(this.userConfigPath, JSON.stringify(config, null, 2));
	}

	async setLocalConfig(config: ConfigFile): Promise<void> {
		const _dir = join(cwd(), ".templates");
		writeFile(this.localConfigPath, JSON.stringify(config, null, 2));
	}

	async setDefaults(config: DetectionConfig): Promise<void> {
		const current = await this.getUserConfig();
		current.defaults = { ...current.defaults, ...config };
		await this.setUserConfig(current);
	}

	async getDefaults(): Promise<DetectionConfig> {
		const userConfig = await this.getUserConfig();
		return userConfig.defaults || {};
	}

	private getDefaultConfig(): ConfigFile {
		return {
			detection: {
				enabled: true,
				priority: ["cli", "env", "local", "git", "context", "user", "global"],
				confirm: "smart",
			},
			defaults: {
				framework: "next",
				features: ["typescript", "tailwind"],
			},
			history: {
				enabled: true,
				maxEntries: 10,
			},
		};
	}
}
