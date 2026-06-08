import { ui } from "../utils/ui.js";

export async function deleteCommand(name: string): Promise<void> {
	const { TemplateService } = await import("../services/template.js");
	const service = new TemplateService();
	try {
		await service.deleteTemplate(name);
		ui.success(`Template "${name}" deleted.`);
	} catch (error) {
		ui.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
