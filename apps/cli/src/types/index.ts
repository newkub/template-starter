export interface Template {
	name: string;
	path: string;
	source: TemplateSource;
}

export type TemplateSource = "bundled" | "user";

export interface UseOptions {
	output?: string;
	overwrite?: boolean;
}

export interface AddOptions {
	force?: boolean;
}

export interface ViewOptions {
	depth?: number;
}

export interface TemplateMetadata {
	name: string;
	source: TemplateSource;
	files: number;
	directories: number;
	hasReadme: boolean;
	hasPackageJson: boolean;
}

// Smart detection types
export interface InitOptions {
	output?: string;
	framework?: string;
	database?: string;
	auth?: string;
	deployment?: string;
	features?: string[];
	auto?: boolean;
	interactive?: boolean;
	smart?: boolean;
	dryRun?: boolean;
	preset?: string;
}

export interface DetectionConfig {
	framework?: string;
	database?: string;
	auth?: string;
	deployment?: string;
	features?: string[];
}

export interface DetectionResult {
	source: "cli" | "env" | "local" | "git" | "context" | "user" | "global";
	config: DetectionConfig;
	confidence: number;
}

export interface ConfigFile {
	detection?: {
		enabled?: boolean;
		priority?: string[];
		confirm?: "always" | "smart" | "never";
	};
	defaults?: DetectionConfig;
	history?: {
		enabled?: boolean;
		maxEntries?: number;
	};
}

export interface HistoryEntry {
	timestamp: string;
	template: string;
	config: DetectionConfig;
}

export interface Preset {
	name: string;
	config: DetectionConfig;
}
