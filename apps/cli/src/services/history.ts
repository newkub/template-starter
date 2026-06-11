import type { DetectionConfig, HistoryEntry } from "../types/index.js";

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

const writeFile = (path: string, content: string): void => {
	// @ts-expect-error
	Bun.write(path, content);
};

const join = (...parts: string[]): string => {
	return parts.join("/").replace(/\/+/g, "/");
};

export class HistoryService {
	private historyPath: string;
	private maxEntries: number = 10;

	constructor (maxEntries: number = 10) {
		this.historyPath = join(homedir(), ".templates", "history.json");
		this.maxEntries = maxEntries;
	}

	async addEntry(template: string, config: DetectionConfig): Promise<void> {
		const history = await this.getHistory();
		const entry: HistoryEntry = {
			timestamp: new Date().toISOString(),
			template,
			config,
		};

		history.unshift(entry);

		// Keep only maxEntries
		if (history.length > this.maxEntries) {
			history.length = this.maxEntries;
		}

		await this.saveHistory(history);
	}

	async getHistory(): Promise<HistoryEntry[]> {
		if (!fileExists(this.historyPath)) {
			return [];
		}

		try {
			const content = readFile(this.historyPath);
			if (!content) return [];
			return JSON.parse(content) as HistoryEntry[];
		} catch {
			return [];
		}
	}

	async getRecentConfig(): Promise<DetectionConfig | null> {
		const history = await this.getHistory();
		if (history.length === 0) return null;
		return history[0].config;
	}

	async clear(): Promise<void> {
		await this.saveHistory([]);
	}

	private async saveHistory(history: HistoryEntry[]): Promise<void> {
		const _dir = join(homedir(), ".templates");
		writeFile(this.historyPath, JSON.stringify(history, null, 2));
	}
}
