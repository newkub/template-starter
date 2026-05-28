import { TemplateService } from "../services/template.js";

export async function deleteCommand(templateName: string): Promise<void> {
	const service = new TemplateService();
	await service.deleteTemplate(templateName);
}
