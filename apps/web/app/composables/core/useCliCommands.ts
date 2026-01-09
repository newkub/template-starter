import type { TemplateConfig, TemplateCommands } from "../../../shared/types/template";
import { ecosystems } from "../../../shared/data/ecosystems";

export function useCliCommands() {
	const generateCommands = (config: TemplateConfig): TemplateCommands => {
		const ecosystem = ecosystems.find((e) => e.id === config.ecosystem);
		if (!ecosystem) {
			throw new Error(`Ecosystem ${config.ecosystem} not found`);
		}

		const pm = config.packageManager || "bun";

		return {
			create: getCreateCommand(config.ecosystem, pm),
			install: getInstallCommand(config.ecosystem, pm, config.libraries),
			dev: getDevCommand(config.ecosystem),
			build: getBuildCommand(config.ecosystem),
		};
	};

	const getCreateCommand = (ecosystem: string, pm: string): string => {
		switch (ecosystem) {
			case "next":
				return `${pm} create next-app@latest my-app --typescript --tailwind --eslint`;
			case "nuxt":
				return `npx nuxi@latest init my-app`;
			case "bun":
				return `bun create vite my-app --template react-ts`;
			case "flutter":
				return `flutter create my_app --org com.example`;
			case "kotlin":
				return `gradle init --type kotlin-application --dsl kotlin --test-framework junit-jupiter --package com.example --project-name my-app`;
			default:
				return `${pm} create my-app`;
		}
	};

	const getInstallCommand = (ecosystem: string, pm: string, libraries: string[]): string => {
		if (libraries.length === 0) return `${pm} install`;

		switch (ecosystem) {
			case "flutter":
				return `flutter pub add ${libraries.join(" ")}`;
			case "kotlin":
				return `gradle add dependency --implementation ${libraries.join(" ")}`;
			default:
				return `${pm} add ${libraries.join(" ")}`;
		}
	};

	const getDevCommand = (ecosystem: string): string => {
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

	const getBuildCommand = (ecosystem: string): string => {
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

	const generateFullScript = (config: TemplateConfig): string => {
		const commands = generateCommands(config);

		return `# Create new project
${commands.create}

# Navigate to project
cd my-app${config.ecosystem === "flutter" || config.ecosystem === "kotlin" ? "" : ""}

# Install dependencies
${commands.install}

# Start development server
${commands.dev}

# Build for production
${commands.build}
`;
	};

	return {
		generateCommands,
		generateFullScript,
	};
}
