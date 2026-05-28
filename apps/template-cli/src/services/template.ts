import { getTemplates, getTemplatePath } from "../utils/index.js";
import { Template, UseOptions } from "../types/index.js";

export class TemplateService {
	async listTemplates(): Promise<Template[]> {
		return await getTemplates();
	}

	async useTemplate(name: string, options: UseOptions): Promise<void> {
		const templates = await this.listTemplates();
		const template = templates.find((t) => t.name === name);

		if (!template) {
			console.error(`Template "${name}" not found`);
			console.log("Available templates:");
			for (const t of templates) {
				console.log(`  - ${t.name}`);
			}
			Bun.exit(1);
		}

		const outputPath = options.output || Bun.cwd();
		console.log(`Using template: ${name}`);
		console.log(`Output path: ${outputPath}`);
		console.log(`Template path: ${template!.path}`);

		// TODO: Implement actual template copying logic
		console.log("Template copying not yet implemented");
	}

	async viewTemplate(name: string): Promise<void> {
		const templates = await this.listTemplates();
		const template = templates.find((t) => t.name === name);

		if (!template) {
			console.error(`Template "${name}" not found`);
			console.log("Available templates:");
			for (const t of templates) {
				console.log(`  - ${t.name}`);
			}
			Bun.exit(1);
		}

		console.log(`Template: ${template!.name}`);
		console.log(`Path: ${template!.path}`);
	}

	async addTemplate(name: string, path: string): Promise<void> {
		const templates = await this.listTemplates();
		const existing = templates.find((t) => t.name === name);

		if (existing) {
			console.error(`Template "${name}" already exists`);
			Bun.exit(1);
		}

		// TODO: Implement actual template adding logic
		console.log(`Adding template: ${name}`);
		console.log(`Path: ${path}`);
		console.log("Template adding not yet implemented");
	}

	async deleteTemplate(name: string): Promise<void> {
		const templates = await this.listTemplates();
		const template = templates.find((t) => t.name === name);

		if (!template) {
			console.error(`Template "${name}" not found`);
			console.log("Available templates:");
			for (const t of templates) {
				console.log(`  - ${t.name}`);
			}
			Bun.exit(1);
		}

		// TODO: Implement actual template deletion logic
		console.log(`Deleting template: ${name}`);
		console.log("Template deletion not yet implemented");
	}
}
