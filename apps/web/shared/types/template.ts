export type Ecosystem = "bun" | "next" | "nuxt" | "flutter" | "kotlin";
export type LibraryCategory = "ui" | "state" | "api" | "auth" | "db";

export interface Library {
	id: string;
	name: string;
	description: string;
	icon: string;
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
}
