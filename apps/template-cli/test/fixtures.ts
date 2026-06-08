import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface TemplateFixture {
	name: string;
	files: Record<string, string>;
}

export interface Fixture {
	root: string;
	cleanup: () => Promise<void>;
}

export async function createFixture(prefix = "test"): Promise<Fixture> {
	const root = await Bun.$`mktemp -d -t ${prefix}-XXXXXX`.text();
	const dir = root.trim();
	return {
		root: dir,
		cleanup: async () => {
			await rm(dir, { recursive: true, force: true });
		},
	};
}

export async function makeTemplate(fixture: Fixture, template: TemplateFixture): Promise<string> {
	const path = join(fixture.root, template.name);
	await mkdir(path, { recursive: true });
	for (const [relativePath, content] of Object.entries(template.files)) {
		const fullPath = join(path, relativePath);
		const parent = fullPath.substring(0, fullPath.lastIndexOf("/"));
		if (parent && parent !== fullPath) {
			await mkdir(parent, { recursive: true });
		}
		await writeFile(fullPath, content, "utf-8");
	}
	return path;
}

export async function readFixtureFile(path: string): Promise<string> {
	return await Bun.file(path).text();
}

export function isWindowsPath(path: string): boolean {
	return /^[a-zA-Z]:[\\/]/.test(path);
}
