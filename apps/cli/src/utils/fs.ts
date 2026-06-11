import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

export async function pathExists(path: string): Promise<boolean> {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
}

export async function ensureDir(path: string): Promise<void> {
	await mkdir(path, { recursive: true });
}

export async function isDirectory(path: string): Promise<boolean> {
	try {
		const info = await stat(path);
		return info.isDirectory();
	} catch {
		return false;
	}
}

export async function listDirectories(path: string): Promise<string[]> {
	const entries = await readdir(path, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
		.map((entry) => entry.name)
		.sort();
}

export interface CopyOptions {
	overwrite?: boolean;
}

export async function copyDirectory(
	source: string,
	destination: string,
	options: CopyOptions = {},
): Promise<{ files: number }> {
	if (!(await pathExists(source))) {
		throw new Error(`Source directory does not exist: ${source}`);
	}
	if (!(await isDirectory(source))) {
		throw new Error(`Source is not a directory: ${source}`);
	}

	if (await pathExists(destination)) {
		if (!options.overwrite) {
			throw new Error(`Destination already exists: ${destination}`);
		}
		await rm(destination, { recursive: true, force: true });
	}

	await ensureDir(destination);

	const stack: string[] = [source];
	let count = 0;

	while (stack.length > 0) {
		const current = stack.pop() as string;
		const rel = relative(source, current);
		const target = rel.length === 0 ? destination : join(destination, rel);
		await ensureDir(target);

		const entries = await readdir(current, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;
			const entrySource = join(current, entry.name);
			const entryTarget = join(target, entry.name);
			if (entry.isDirectory()) {
				stack.push(entrySource);
			} else if (entry.isFile()) {
				const content = await Bun.file(entrySource).arrayBuffer();
				await ensureDir(dirname(entryTarget));
				await Bun.write(entryTarget, content);
				count += 1;
			} else if (entry.isSymbolicLink()) {
				const linkTarget = await Bun.file(entrySource).text();
				await ensureDir(dirname(entryTarget));
				await Bun.write(entryTarget, linkTarget);
				count += 1;
			}
		}
	}

	return { files: count };
}

export interface DirectoryListing {
	path: string;
	entries: DirectoryEntry[];
}

export interface DirectoryEntry {
	name: string;
	type: "file" | "directory" | "symlink" | "other";
	children?: DirectoryListing;
}

export async function describeDirectory(
	root: string,
	depth = 2,
): Promise<DirectoryListing> {
	const walk = async (path: string, remaining: number): Promise<DirectoryListing> => {
		const entries: DirectoryEntry[] = [];
		const dirEntries = await readdir(path, { withFileTypes: true });
		for (const entry of dirEntries) {
			if (entry.name.startsWith(".")) continue;
			const childPath = join(path, entry.name);
			let type: DirectoryEntry["type"];
			if (entry.isDirectory()) type = "directory";
			else if (entry.isFile()) type = "file";
			else if (entry.isSymbolicLink()) type = "symlink";
			else type = "other";

			const listing: DirectoryListing = {
				path: childPath,
				entries: type === "directory" && remaining > 0 ? (await walk(childPath, remaining - 1)).entries : [],
			};
			entries.push({ name: entry.name, type, children: remaining > 0 ? listing : undefined });
		}
		return { path, entries };
	};

	return walk(root, depth);
}

export function relativeToCwd(path: string): string {
	const cwd = process.cwd();
	const rel = relative(cwd, path);
	return rel.length === 0 ? "." : rel.split(sep).join("/");
}
