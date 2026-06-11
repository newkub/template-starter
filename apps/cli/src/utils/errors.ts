export class TemplateNotFoundError extends Error {
	override readonly name = "TemplateNotFoundError";
	constructor(public readonly name: string) {
		super(`Template "${name}" not found`);
	}
}

export class TemplateAlreadyExistsError extends Error {
	override readonly name = "TemplateAlreadyExistsError";
	constructor(public readonly name: string) {
		super(`Template "${name}" already exists`);
	}
}

export class PathNotFoundError extends Error {
	override readonly name = "PathNotFoundError";
	constructor(public readonly path: string) {
		super(`Path not found: ${path}`);
	}
}

export class PathAlreadyExistsError extends Error {
	override readonly name = "PathAlreadyExistsError";
	constructor(public readonly path: string) {
		super(`Path already exists: ${path}`);
	}
}

export class RegistryError extends Error {
	override readonly name = "RegistryError";
	constructor(message: string) {
		super(message);
	}
}
