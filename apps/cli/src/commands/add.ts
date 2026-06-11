import { resolve } from "node:path";
import { ui } from "../utils/ui.js";

export interface AddOptions {
	name?: string;
	force?: boolean;
}

export async function addCommand(source: string, options: AddOptions = {}): Promise<void> {
	const { TemplateService } = await import("../services/template.js");
	const service = new TemplateService();
	try {
		const absolute = resolve(source);
		const template = await service.addTemplate(absolute, options.name, { force: options.force });
		ui.success(`Template "${template.name}" added from ${source}`);
		ui.dim(`Stored at: ${template.path}`);
	} catch (error) {
		ui.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
