import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const BUNDLED_TEMPLATES_DIR = join(PACKAGE_ROOT, "templates");

export function getBundledTemplatesDir(): string {
	return BUNDLED_TEMPLATES_DIR;
}

export function getBundledTemplatePath(name: string): string {
	return join(BUNDLED_TEMPLATES_DIR, name);
}

export function getUserRegistryDir(): string {
	const configured = process.env.TEMPLATES_REGISTRY_DIR;
	if (configured && configured.trim().length > 0) {
		return resolve(configured);
	}
	const home = process.env.TEMPLATES_HOME ?? join(homedir(), ".templates");
	return home;
}

export function getUserTemplatePath(name: string): string {
	return join(getUserRegistryDir(), name);
}
