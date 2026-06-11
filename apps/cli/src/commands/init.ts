import type { InitOptions } from "../types/index.js";
import { ConfigService } from "../services/config.js";
import { DetectionService } from "../services/detection.js";
import { HistoryService } from "../services/history.js";
import { TemplateService } from "../services/template.js";

export async function initCommand(name: string | undefined, options: InitOptions = {}): Promise<void> {
	const detectionService = new DetectionService();
	const _configService = new ConfigService();
	const historyService = new HistoryService();
	const templateService = new TemplateService();

	// Detect configuration
	const detection = await detectionService.detect({
		framework: options.framework,
		database: options.database,
		auth: options.auth,
		deployment: options.deployment,
		features: options.features,
	});

	console.log(`Detected configuration (from ${detection.source}):`);
	console.log(`  Framework: ${detection.config.framework || "not specified"}`);
	console.log(`  Database: ${detection.config.database || "not specified"}`);
	console.log(`  Auth: ${detection.config.auth || "not specified"}`);
	console.log(`  Deployment: ${detection.config.deployment || "not specified"}`);
	console.log(`  Features: ${detection.config.features?.join(", ") || "not specified"}`);
	console.log(`  Confidence: ${(detection.confidence * 100).toFixed(0)}%`);

	// Determine template name from config
	const templateName = determineTemplateName(detection.config);
	console.log(`\nSelected template: ${templateName}`);

	// Dry run mode
	if (options.dryRun) {
		console.log("\n[Dry run] Would create project with the above configuration.");
		return;
	}

	// Auto mode - no confirmation
	if (options.auto) {
		console.log("\n[Auto mode] Creating project without confirmation...");
	} else {
		// Smart mode - confirm if confidence is low
		if (options.smart !== false && detection.confidence < 0.8) {
			console.log("\nLow confidence detection. Confirm configuration? (Y/n)");
			// In real implementation, would wait for user input
			console.log("[Simulated: User confirmed]");
		}
	}

	// Determine output directory
	const output = name || options.output || `./${templateName}-project`;

	// Use the template
	try {
		console.log(`\nCreating project from template "${templateName}"...`);
		const result = await templateService.useTemplate(templateName, {
			output,
			overwrite: false,
		});
		console.log(`✓ Created ${result.files} files in ${output}`);

		// Save to history
		await historyService.addEntry(templateName, detection.config);
		console.log("✓ Saved to history");

		console.log("\nProject created successfully!");
		console.log(`  Location: ${output}`);
		console.log(`  Template: ${templateName}`);
	} catch (error) {
		console.error(`✗ Failed to create project: ${error instanceof Error ? error.message : String(error)}`);
		// @ts-ignore
		process.exit(1);
	}
}

function determineTemplateName(config: DetectionConfig): string {
	// Simple heuristic to map config to template name
	const framework = config.framework || "next";
	const _database = config.database || "";
	const _auth = config.auth || "";

	// Map to available templates
	const templates = [
		"next",
		"nuxt",
		"vite-react",
		"bun-lib",
		"node-lib",
		"tauri-nuxt",
		"web-extension-wxt-nuxt",
		"vscode-vue",
		"moonrepo",
		"turborepo",
		"rust-clean",
		"rust-layered",
		"slidev",
		"tutorial",
		"vitepress",
	];

	// Try to find exact match
	if (templates.includes(framework)) {
		return framework;
	}

	// Fallback to next
	return "next";
}
