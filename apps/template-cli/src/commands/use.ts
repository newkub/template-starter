import { TemplateNotFoundError } from "../utils/errors.js";
import { ui } from "../utils/ui.js";
import type { UseOptions } from "../types/index.js";

export async function useCommand(name: string, options: UseOptions = {}): Promise<void> {
	const { TemplateService } = await import("../services/template.js");
	const service = new TemplateService();
	try {
		const result = await service.useTemplate(name, options);
		ui.success(`Copied ${result.files} file${result.files === 1 ? "" : "s"} from "${name}"`);
		ui.dim(`From: ${result.from}`);
		ui.dim(`To:   ${result.to}`);
	} catch (error) {
		if (error instanceof TemplateNotFoundError) {
			ui.error(error.message);
			const templates = await service.listTemplates();
			if (templates.length > 0) {
				ui.info("Available templates:");
				for (const t of templates) ui.dim(`- ${t.name}`);
			}
		} else {
			ui.error(error instanceof Error ? error.message : String(error));
		}
		process.exitCode = 1;
	}
}
