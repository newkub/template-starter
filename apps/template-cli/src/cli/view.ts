import { TemplateService } from "../services/template.js";

export async function viewCommand(templateName: string): Promise<void> {
	const service = new TemplateService();
	await service.viewTemplate(templateName);
}
