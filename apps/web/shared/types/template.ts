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

export interface TemplateVersion {
	id: string;
	templateId: string;
	version: string;
	config: TemplateConfig;
	changes: string[];
	createdAt: string;
	createdBy?: string;
}

export interface VersionHistory {
	templateId: string;
	versions: TemplateVersion[];
	currentVersion: string;
}

export interface LibraryRecommendation {
	library: Library;
	reason: string;
	confidence: number;
	relatedLibraries?: string[];
}

export interface UseCase {
	id: string;
	name: string;
	description: string;
	icon: string;
	recommendedLibraries: Record<Ecosystem, string[]>;
}

export interface MarketplaceTemplate {
	id: string;
	name: string;
	description: string;
	icon: string;
	config: TemplateConfig;
	author: {
		id: string;
		name: string;
		avatar?: string;
	};
	stats: {
		rating: number;
		ratingCount: number;
		downloads: number;
		views: number;
	};
	tags: string[];
	createdAt: string;
	updatedAt: string;
	isFeatured?: boolean;
}

export interface DeployConfig {
	provider: "vercel" | "netlify" | "cloudflare" | "github";
	projectName: string;
	environmentVariables?: Record<string, string>;
	buildCommand?: string;
	outputDirectory?: string;
}

export interface DeployStatus {
	id: string;
	templateId: string;
	provider: DeployConfig["provider"];
	status: "pending" | "building" | "success" | "failed";
	url?: string;
	error?: string;
	startedAt: string;
	completedAt?: string;
}

export interface TestResult {
	id: string;
	templateId: string;
	version: string;
	status: "passed" | "failed" | "warning" | "skipped";
	tests: {
		name: string;
		status: "passed" | "failed" | "skipped";
		message?: string;
		duration: number;
	}[];
	startedAt: string;
	completedAt: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
	suggestions: string[];
}

export interface Team {
	id: string;
	name: string;
	members: TeamMember[];
	createdAt: string;
}

export interface TeamMember {
	id: string;
	name: string;
	email: string;
	role: "owner" | "admin" | "editor" | "viewer";
	avatar?: string;
	joinedAt: string;
}

export interface SharedTemplate {
	id: string;
	templateId: string;
	teamId: string;
	sharedBy: string;
	permission: "read" | "write" | "admin";
	sharedAt: string;
}

export interface AnalyticsData {
	templateId: string;
	date: string;
	metrics: {
		views: number;
		downloads: number;
		generations: number;
		deployments: number;
	};
	popularLibraries: {
		libraryId: string;
		count: number;
	}[];
}

export interface DependencyConflict {
	library1: string;
	library2: string;
	severity: "error" | "warning" | "info";
	message: string;
	resolution?: string;
	alternatives?: string[];
}

export interface DocumentationConfig {
	includeReadme: boolean;
	includeChangelog: boolean;
	includeContributing: boolean;
	includeLicense: boolean;
	customSections?: {
		title: string;
		content: string;
	}[];
}

export interface ExportConfig {
	format: "github" | "gitlab" | "folder";
	repoName?: string;
	repoDescription?: string;
	isPrivate?: boolean;
	includeGit?: boolean;
}

export interface ExportResult {
	id: string;
	format: ExportConfig["format"];
	url?: string;
	path?: string;
	status: "pending" | "success" | "failed";
	error?: string;
	exportedAt: string;
}
