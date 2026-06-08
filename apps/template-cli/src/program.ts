import cac from "cac";
import { addCommand } from "./commands/add.js";
import { deleteCommand } from "./commands/delete.js";
import { listCommand } from "./commands/list.js";
import { useCommand } from "./commands/use.js";
import { viewCommand } from "./commands/view.js";

export interface ProgramOptions {
	version?: string;
}

export function buildProgram(options: ProgramOptions = {}): cac.CAC {
	const cli = cac(options.version ?? "templates");

	cli
		.command("list", "List all available templates")
		.option("--source <source>", "Filter by source: bundled, user, or all", { default: "all" })
		.option("--json", "Output as JSON")
		.action(async (options: { source?: "bundled" | "user" | "all"; json?: boolean }) => {
			await listCommand(options);
		});

	cli
		.command("use <name>", "Copy a template into the current or specified directory")
		.option("-o, --output <path>", "Output directory (defaults to current directory)")
		.option("--overwrite", "Overwrite destination if it already exists")
		.action(async (name: string, options: { output?: string; overwrite?: boolean }) => {
			await useCommand(name, options);
		});

	cli
		.command("view <name>", "Show template details and contents")
		.option("--depth <depth>", "Maximum directory depth to display")
		.option("--json", "Output as JSON")
		.action(async (name: string, options: { depth?: string; json?: boolean }) => {
			const depth = options.depth ? Number.parseInt(options.depth, 10) : undefined;
			await viewCommand(name, { depth, json: options.json });
		});

	cli
		.command("add <source>", "Register a template from a local directory")
		.option("-n, --name <name>", "Override the template name")
		.option("--force", "Replace an existing user template with the same name")
		.action(async (source: string, options: { name?: string; force?: boolean }) => {
			await addCommand(source, options);
		});

	cli
		.command("delete <name>", "Remove a user-registered template")
		.alias("rm")
		.action(async (name: string) => {
			await deleteCommand(name);
		});

	cli.help();
	cli.version(options.version ?? "0.0.0");

	return cli;
}
