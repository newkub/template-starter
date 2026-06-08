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
