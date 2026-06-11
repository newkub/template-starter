import { TemplateNotFoundError } from "../utils/errors.js";
import { relativeToCwd } from "../utils/fs.js";
import { ui } from "../utils/ui.js";
import type { DirectoryEntry } from "../utils/fs.js";

export interface ViewOptions {
	depth?: number;
	json?: boolean;
}

export async function viewCommand(name: string, options: ViewOptions = {}): Promise<void> {
	const { TemplateService } = await import("../services/template.js");
	const service = new TemplateService();
	try {
		const { template, metadata, tree } = await service.viewTemplate(name);

		if (options.json) {
			console.log(JSON.stringify({ template, metadata, tree }, null, 2));
			return;
		}

		ui.info(`Template: ${template.name} [${template.source}]`);
		ui.divider();
		ui.dim(`Path:           ${relativeToCwd(template.path)}`);
		ui.dim(`Files:          ${metadata.files}`);
		ui.dim(`Directories:    ${metadata.directories}`);
		ui.dim(`Has README:     ${metadata.hasReadme ? "yes" : "no"}`);
		ui.dim(`Has package.json: ${metadata.hasPackageJson ? "yes" : "no"}`);
		ui.divider();
		ui.info("Contents:");
		for (const entry of tree.entries) {
			printEntry(entry, 0);
		}
	} catch (error) {
		if (error instanceof TemplateNotFoundError) {
			ui.error(error.message);
		} else {
			ui.error(error instanceof Error ? error.message : String(error));
		}
		process.exitCode = 1;
	}
}

function printEntry(entry: DirectoryEntry, indent: number): void {
	const prefix = "  ".repeat(indent);
	const icon = entry.type === "directory" ? "▸" : entry.type === "file" ? "•" : "↪";
	ui.dim(`${prefix}${icon} ${entry.name}`);
	if (entry.children) {
		for (const child of entry.children.entries) {
			printEntry(child, indent + 1);
		}
	}
}
