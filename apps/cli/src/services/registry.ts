import { mkdir, rm, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import { copyDirectory, ensureDir, isDirectory, pathExists } from "../utils/fs.js";
import { getUserRegistryDir, getUserTemplatePath } from "../utils/paths.js";

export class TemplateRegistry {
	constructor(private readonly root: string = getUserRegistryDir()) {}

	get rootDir(): string {
		return this.root;
	}

	async init(): Promise<void> {
		await ensureDir(this.root);
	}

	async has(name: string): Promise<boolean> {
		return await pathExists(getUserTemplatePath(name));
	}

	async list(): Promise<string[]> {
		if (!(await pathExists(this.root))) return [];
		const info = await stat(this.root).catch(() => null);
		if (!info || !info.isDirectory()) return [];
		const { readdir } = await import("node:fs/promises");
		const entries = await readdir(this.root, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
			.map((entry) => entry.name)
			.sort();
	}

	async resolveSource(name: string): Promise<string> {
		const userPath = getUserTemplatePath(name);
		if (await pathExists(userPath)) return userPath;
		throw new Error(`User template "${name}" not found in registry`);
	}

	async addFromPath(source: string, name?: string): Promise<string> {
		if (!(await pathExists(source))) {
			throw new Error(`Source path does not exist: ${source}`);
		}
		if (!(await isDirectory(source))) {
			throw new Error(`Source path is not a directory: ${source}`);
		}

		await this.init();

		const targetName = name ?? basename(source);
		const targetPath = getUserTemplatePath(targetName);
		if (await pathExists(targetPath)) {
			throw new Error(`Template "${targetName}" already exists in registry`);
		}

		await ensureDir(join(this.root, ".tmp"));
		const staging = join(this.root, ".tmp", `${targetName}-${Date.now()}`);
		await ensureDir(staging);
		await copyDirectory(source, staging, { overwrite: true });
		const finalPath = getUserTemplatePath(targetName);
		await mkdir(finalPath, { recursive: true });
		const { rename, readdir } = await import("node:fs/promises");
		const entries = await readdir(staging);
		for (const entry of entries) {
			await rename(join(staging, entry), join(finalPath, entry));
		}
		await rm(staging, { recursive: true, force: true });
		return finalPath;
	}

	async remove(name: string): Promise<void> {
		const path = getUserTemplatePath(name);
		if (!(await pathExists(path))) {
			throw new Error(`Template "${name}" not found in registry`);
		}
		await rm(path, { recursive: true, force: true });
	}
}
