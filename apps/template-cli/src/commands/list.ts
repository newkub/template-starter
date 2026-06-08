import type { Template } from "../types/index.js";
import { ui } from "../utils/ui.js";

export interface ListOptions {
	source?: "bundled" | "user" | "all";
	json?: boolean;
}

export async function listCommand(options: ListOptions = {}): Promise<void> {
	const { TemplateService } = await import("../services/template.js");
	const service = new TemplateService();
	const source = options.source ?? "all";
	const includeBundled = source === "all" || source === "bundled";
	const includeUser = source === "all" || source === "user";
	const templates = await service.listTemplates({ includeBundled, includeUser });

	if (options.json) {
		console.log(JSON.stringify(templates, null, 2));
		return;
	}

	if (templates.length === 0) {
		ui.warn("No templates available.");
		ui.dim("Run `templates add <path>` to register a new template.");
		return;
	}

	ui.info(`${templates.length} template${templates.length === 1 ? "" : "s"} available:`);
	for (const t of templates) {
		printTemplateRow(t);
	}
}

function printTemplateRow(template: Template): void {
	const tag = template.source === "user" ? "[user]" : "[bundled]";
	const padding = " ".repeat(Math.max(0, 10 - template.name.length));
	ui.dim(`${template.name}${padding}${tag}  ${template.path}`);
}
