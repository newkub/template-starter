import cac from "cac";
import { addCommand } from "./commands/add.js";
import { deleteCommand } from "./commands/delete.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { useCommand } from "./commands/use.js";
import { viewCommand } from "./commands/view.js";

export interface ProgramOptions {
	version?: string;
}

export function buildProgram(options: ProgramOptions = {}): cac.CAC {
	const cli = cac(options.version ?? "templates");

	cli
		.command("init [name]", "Initialize a new project with smart detection")
		.option("-o, --output <path>", "Output directory")
		.option("-f, --framework <framework>", "Framework to use")
		.option("-d, --database <database>", "Database to use")
		.option("-a, --auth <auth>", "Authentication provider")
		.option("-D, --deployment <deployment>", "Deployment target")
		.option("--features <features>", "Features (comma-separated)")
		.option("--auto", "Auto mode - no confirmation")
		.option("--interactive", "Force interactive mode")
		.option("--smart", "Smart detection mode (default)")
		.option("--dry-run", "Show what would be done without doing it")
		.option("--preset <preset>", "Use a preset configuration")
		.action(async (name: string | undefined, options: Record<string, string | boolean | undefined>) => {
			const features = options.features ? String(options.features).split(",") : undefined;
			await initCommand(name, {
				output: options.output as string | undefined,
				framework: options.framework as string | undefined,
				database: options.database as string | undefined,
				auth: options.auth as string | undefined,
				deployment: options.deployment as string | undefined,
				features,
				auto: options.auto as boolean | undefined,
				interactive: options.interactive as boolean | undefined,
				smart: options.smart as boolean | undefined,
				dryRun: options.dryRun as boolean | undefined,
				preset: options.preset as string | undefined,
			});
		});

	cli
		.command("list", "List all available templates")
		.option("--source <source>", "Filter by source: bundled, user, or all", { default: "all" })
		.option("--json", "Output as JSON")
		.action(async (options: { source?: "bundled" | "user" | "all"; json?: boolean; }) => {
			await listCommand(options);
		});

	cli
		.command("use <name>", "Copy a template into the current or specified directory")
		.option("-o, --output <path>", "Output directory (defaults to current directory)")
		.option("--overwrite", "Overwrite destination if it already exists")
		.action(async (name: string, options: { output?: string; overwrite?: boolean; }) => {
			await useCommand(name, options);
		});

	cli
		.command("view <name>", "Show template details and contents")
		.option("--depth <depth>", "Maximum directory depth to display")
		.option("--json", "Output as JSON")
		.action(async (name: string, options: { depth?: string; json?: boolean; }) => {
			const depth = options.depth ? Number.parseInt(options.depth, 10) : undefined;
			await viewCommand(name, { depth, json: options.json });
		});

	cli
		.command("add <source>", "Register a template from a local directory")
		.option("-n, --name <name>", "Override the template name")
		.option("--force", "Replace an existing user template with the same name")
		.action(async (source: string, options: { name?: string; force?: boolean; }) => {
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
