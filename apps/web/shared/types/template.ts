export type Ecosystem = "bun" | "next" | "nuxt" | "flutter" | "kotlin";
export type LibraryCategory = "ui" | "state" | "api" | "auth" | "db";

export interface Library {
	id: string;
	name: string;
	description: string;
	icon: string;
	docsUrl?: string;
	githubUrl?: string;
	popularity?: number;
	dependencies?: string[];
	examples?: string[];
}

export interface EcosystemConfig {
	id: Ecosystem;
	name: string;
	description: string;
	icon: string;
	libraries: Record<LibraryCategory, Library[]>;
}

export interface LibraryCategoryConfig {
	id: LibraryCategory;
	name: string;
	icon: string;
}

export interface TemplateConfig {
	ecosystem: Ecosystem;
	libraries: string[];
	packageManager?: string;
}

export interface GeneratedTemplate {
	config: TemplateConfig;
	files: TemplateFile[];
	commands: TemplateCommands;
}

export interface TemplateFile {
	path: string;
	content: string;
	type: "config" | "code" | "markdown" | "json";
}

export interface TemplateCommands {
	create: string;
	install: string;
	dev: string;
	build: string;
}

export interface SavedConfig {
	id: string;
	name: string;
	config: TemplateConfig;
	createdAt: string;
	updatedAt: string;
}

export interface TemplateHistory {
	id: string;
	config: TemplateConfig;
	createdAt: string;
}

export interface Preset {
	id: string;
	name: string;
	description: string;
	icon: string;
	config: TemplateConfig;
	tags: string[];
}

export interface CustomLibrary {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: LibraryCategory;
	docsUrl?: string;
	githubUrl?: string;
}

export interface CompatibilityIssue {
	type: "conflict" | "warning" | "suggestion";
	message: string;
	libraries: string[];
	alternatives?: string[];
}

export interface TemplateComparison {
	id: string;
	name: string;
	config: TemplateConfig;
	score: number;
	pros: string[];
	cons: string[];
}

export interface LibraryStats {
	id: string;
	name: string;
	usageCount: number;
	trend: "up" | "down" | "stable";
}

export interface EcosystemStats {
	id: Ecosystem;
	name: string;
	usageCount: number;
	popularLibraries: LibraryStats[];
}
