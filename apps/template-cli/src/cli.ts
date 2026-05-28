import cac from "cac";
import { useCommand } from "./cli/use.js";
import { viewCommand } from "./cli/view.js";
import { addCommand } from "./cli/add.js";
import { deleteCommand } from "./cli/delete.js";
import { TemplateService } from "./services/template.js";

const cli = cac("templates");

cli
	.command("use <template-name>", "Use a template")
	.option("-o, --output <path>", "Output directory")
	.action(async (templateName: string, options: any) => {
		await useCommand(templateName, options);
	});

cli.command("view <template-name>", "View template details").action(async (templateName: string) => {
	await viewCommand(templateName);
});

cli
	.command("add <template-name> <path>", "Add a new template")
	.action(async (templateName: string, path: string) => {
		await addCommand(templateName, path);
	});

cli.command("delete <template-name>", "Delete a template").action(async (templateName: string) => {
	await deleteCommand(templateName);
});

cli.command("list", "List all templates").action(async () => {
	const service = new TemplateService();
	const templates = await service.listTemplates();
	console.log("Available templates:");
	for (const template of templates) {
		console.log(`  - ${template.name}`);
	}
});

cli.help();
cli.parse();
