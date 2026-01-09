import type { TemplateConfig, GeneratedTemplate, TemplateFile, TemplateCommands, Ecosystem } from "../../../shared/types/template";
import { ecosystems } from "../../../shared/data/ecosystems";

export function useTemplateGenerator() {
	const generateTemplate = (config: TemplateConfig): GeneratedTemplate => {
		const ecosystem = ecosystems.find((e) => e.id === config.ecosystem);
		if (!ecosystem) {
			throw new Error(`Ecosystem ${config.ecosystem} not found`);
		}

		const files = generateFiles(config, ecosystem);
		const commands = generateCommands(config, ecosystem);

		return {
			config,
			files,
			commands,
		};
	};

	const generateFiles = (config: TemplateConfig, ecosystem: any): TemplateFile[] => {
		const files: TemplateFile[] = [];

		const packageJson = generatePackageJson(config, ecosystem);
		files.push({
			path: "package.json",
			content: JSON.stringify(packageJson, null, 2),
			type: "json",
		});

		const readme = generateReadme(config, ecosystem);
		files.push({
			path: "README.md",
			content: readme,
			type: "markdown",
		});

		const configFiles = generateConfigFiles(config, ecosystem);
		files.push(...configFiles);

		return files;
	};

	const generatePackageJson = (config: TemplateConfig, ecosystem: any) => {
		const dependencies: Record<string, string> = {};
		const devDependencies: Record<string, string> = {};

		config.libraries.forEach((libId) => {
			for (const category of Object.values(ecosystem.libraries) as any[]) {
				const lib = category.find((l: any) => l.id === libId);
				if (lib) {
					dependencies[libId] = "latest";
				}
			}
		});

		return {
			name: `my-${config.ecosystem}-app`,
			version: "0.1.0",
			private: true,
			scripts: {
				dev: getDevCommand(config.ecosystem),
				build: getBuildCommand(config.ecosystem),
				start: getStartCommand(config.ecosystem),
			},
			dependencies,
			devDependencies,
		};
	};

	const generateReadme = (config: TemplateConfig, ecosystem: any) => {
		const libraryNames = config.libraries.map((libId) => {
			for (const category of Object.values(ecosystem.libraries) as any[]) {
				const lib = category.find((l: any) => l.id === libId);
				if (lib) return lib.name;
			}
			return libId;
		});

		return `# My ${ecosystem.name} App

Generated with Template Selector

## Features

${libraryNames.map((name) => `- ${name}`).join("\n")}

## Installation

\`\`\`bash
${getInstallCommand(config.ecosystem, config.packageManager || "bun")}
\`\`\`

## Development

\`\`\`bash
${getDevCommand(config.ecosystem)}
\`\`\`

## Build

\`\`\`bash
${getBuildCommand(config.ecosystem)}
\`\`\`
`;
	};

	const generateConfigFiles = (config: TemplateConfig, _ecosystem: any): TemplateFile[] => {
		const files: TemplateFile[] = [];

		if (config.ecosystem === "next") {
			files.push({
				path: "next.config.js",
				content: `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,
				type: "code",
			});
		} else if (config.ecosystem === "nuxt") {
			files.push({
				path: "nuxt.config.ts",
				content: `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})`,
				type: "code",
			});
		} else if (config.ecosystem === "bun") {
			files.push({
				path: "bunfig.toml",
				content: `[install.scopes]
"@myorg" = "https://npm.pkg.github.com/myorg"`,
				type: "code",
			});
		}

		return files;
	};

	const generateCommands = (config: TemplateConfig, _ecosystem: any): TemplateCommands => {
		const pm = config.packageManager || "bun";

		return {
			create: getCreateCommand(config.ecosystem, pm),
			install: getInstallCommand(config.ecosystem, pm),
			dev: getDevCommand(config.ecosystem),
			build: getBuildCommand(config.ecosystem),
		};
	};

	const getCreateCommand = (ecosystem: Ecosystem, pm: string): string => {
		switch (ecosystem) {
			case "next":
				return `${pm} create next-app@latest my-app`;
			case "nuxt":
				return `npx nuxi@latest init my-app`;
			case "bun":
				return `bun create vite my-app`;
			case "flutter":
				return `flutter create my_app`;
			case "kotlin":
				return `gradle init`;
			default:
				return `${pm} create my-app`;
		}
	};

	const getInstallCommand = (ecosystem: Ecosystem, pm: string): string => {
		switch (ecosystem) {
			case "flutter":
				return "flutter pub get";
			case "kotlin":
				return "gradle build";
			default:
				return `${pm} install`;
		}
	};

	const getDevCommand = (ecosystem: Ecosystem): string => {
		switch (ecosystem) {
			case "next":
				return "npm run dev";
			case "nuxt":
				return "npm run dev";
			case "bun":
				return "bun run dev";
			case "flutter":
				return "flutter run";
			case "kotlin":
				return "gradle run";
			default:
				return "npm run dev";
		}
	};

	const getBuildCommand = (ecosystem: Ecosystem): string => {
		switch (ecosystem) {
			case "next":
				return "npm run build";
			case "nuxt":
				return "npm run build";
			case "bun":
				return "bun run build";
			case "flutter":
				return "flutter build apk";
			case "kotlin":
				return "gradle build";
			default:
				return "npm run build";
		}
	};

	const getStartCommand = (ecosystem: Ecosystem): string => {
		switch (ecosystem) {
			case "next":
				return "npm start";
			case "nuxt":
				return "npm run preview";
			case "bun":
				return "bun run start";
			default:
				return "npm start";
		}
	};

	return {
		generateTemplate,
		generateFiles,
		generateCommands,
	};
}
