import { TemplateService } from "../services/template.js";

export async function addCommand(templateName: string, path: string): Promise<void> {
	const service = new TemplateService();
	await service.addTemplate(templateName, path);
}
