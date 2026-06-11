import { readdir, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import type { Template, TemplateMetadata, UseOptions } from "../types/index.js";
import { TemplateNotFoundError } from "../utils/errors.js";
import { copyDirectory, describeDirectory, listDirectories, pathExists } from "../utils/fs.js";
import { getBundledTemplatePath, getBundledTemplatesDir } from "../utils/paths.js";
import { TemplateRegistry } from "./registry.js";

export interface ListOptions {
	includeUser?: boolean;
	includeBundled?: boolean;
}

export class TemplateService {
	private readonly registry: TemplateRegistry;

	constructor(registry?: TemplateRegistry) {
		this.registry = registry ?? new TemplateRegistry();
	}

	get userRegistry(): TemplateRegistry {
		return this.registry;
	}

	async listTemplates(options: ListOptions = {}): Promise<Template[]> {
		const includeUser = options.includeUser ?? true;
		const includeBundled = options.includeBundled ?? true;
		const results: Template[] = [];
		const seen = new Set<string>();

		if (includeUser) {
			await this.registry.init();
			const user = await this.registry.list();
			for (const name of user) {
				if (seen.has(name)) continue;
				seen.add(name);
				results.push({
					name,
					path: join(this.registry.rootDir, name),
					source: "user",
				});
			}
		}

		if (includeBundled) {
			const bundled = await this.loadBundledTemplates();
			for (const t of bundled) {
				if (seen.has(t.name)) continue;
				seen.add(t.name);
				results.push(t);
			}
		}

		return results;
	}

	async useTemplate(name: string, options: UseOptions = {}): Promise<{ from: string; to: string; files: number }> {
		const template = await this.findTemplate(name);
		const output = options.output ?? process.cwd();
		const overwrite = options.overwrite ?? false;
		const result = await copyDirectory(template.path, output, { overwrite });
		return { from: template.path, to: output, files: result.files };
	}

	async viewTemplate(name: string): Promise<{ template: Template; metadata: TemplateMetadata; tree: Awaited<ReturnType<typeof describeDirectory>> }> {
		const template = await this.findTemplate(name);
		const tree = await describeDirectory(template.path, 2);
		const metadata = await this.buildMetadata(template);
		return { template, metadata, tree };
	}

	async addTemplate(source: string, name?: string, options: { force?: boolean } = {}): Promise<Template> {
		await this.registry.init();
		const targetName = name ?? basename(source);
		if ((await this.registry.has(targetName)) && !options.force) {
			throw new Error(`Template "${targetName}" already exists. Use --force to overwrite.`);
		}
		if (options.force && (await this.registry.has(targetName))) {
			await this.registry.remove(targetName);
		}
		const path = await this.registry.addFromPath(source, name);
		return { name: targetName, path, source: "user" };
	}

	async deleteTemplate(name: string): Promise<void> {
		const template = await this.findTemplate(name);
		if (template.source !== "user") {
			throw new Error(`Cannot delete bundled template "${name}". Only user templates can be removed.`);
		}
		await this.registry.remove(name);
	}

	private async findTemplate(name: string): Promise<Template> {
		const templates = await this.listTemplates();
		const template = templates.find((t) => t.name === name);
		if (!template) {
			throw new TemplateNotFoundError(name);
		}
		return template;
	}

	private async loadBundledTemplates(): Promise<Template[]> {
		const root = getBundledTemplatesDir();
		if (!(await pathExists(root))) return [];
		const names = await listDirectories(root);
		return names.map((name) => ({
			name,
			path: getBundledTemplatePath(name),
			source: "bundled" as const,
		}));
	}

	private async buildMetadata(template: Template): Promise<TemplateMetadata> {
		let files = 0;
		let directories = 0;
		const stack = [template.path];
		const seen = new Set<string>();

		while (stack.length > 0) {
			const current = stack.pop() as string;
			if (seen.has(current)) continue;
			seen.add(current);
			const info = await stat(current).catch(() => null);
			if (!info || !info.isDirectory()) continue;
			directories += 1;
			const entries = await readdir(current, { withFileTypes: true });
			for (const entry of entries) {
				if (entry.name.startsWith(".")) continue;
				const child = join(current, entry.name);
				if (entry.isDirectory()) {
					stack.push(child);
				} else if (entry.isFile()) {
					files += 1;
				}
			}
		}

		return {
			name: template.name,
			source: template.source,
			files,
			directories,
			hasReadme: await pathExists(join(template.path, "README.md")),
			hasPackageJson: await pathExists(join(template.path, "package.json")),
		};
	}
}
