import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator("node-package", {
		description: "Create a new Node TypeScript package in packages/<name>",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "What is the package folder name (under packages/)?",
				validate: (input: string) => {
					if (!input) return "name is required";
					if (input.includes(" ")) return "name cannot include spaces";
					if (input.includes("/")) return "name cannot include '/'";
					if (input.includes("\\")) return "name cannot include '\\'";
					return true;
				},
			},
			{
				type: "input",
				name: "packageName",
				message: "What is the npm package name (package.json name)?",
				default: (answers: Record<string, unknown>) =>
					String(answers["name"] ?? ""),
				validate: (input: string) => {
					if (!input) return "packageName is required";
					if (input.includes(" ")) return "packageName cannot include spaces";
					return true;
				},
			},
			{
				type: "input",
				name: "description",
				message: "What is the package description?",
				default: "",
			},
		],
		actions: [
			{
				type: "addMany",
				destination: "{{ turbo.paths.root }}/packages/{{ dashCase name }}",
				base: "templates/node-package",
				templateFiles: "templates/node-package/**",
			},
		],
	});

	plop.setGenerator("bun-package", {
		description: "Create a new Bun TypeScript package in packages/<name>",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "What is the package folder name (under packages/)?",
				validate: (input: string) => {
					if (!input) return "name is required";
					if (input.includes(" ")) return "name cannot include spaces";
					if (input.includes("/")) return "name cannot include '/'";
					if (input.includes("\\")) return "name cannot include '\\'";
					return true;
				},
			},
			{
				type: "input",
				name: "packageName",
				message: "What is the npm package name (package.json name)?",
				default: (answers: Record<string, unknown>) =>
					String(answers["name"] ?? ""),
				validate: (input: string) => {
					if (!input) return "packageName is required";
					if (input.includes(" ")) return "packageName cannot include spaces";
					return true;
				},
			},
			{
				type: "input",
				name: "description",
				message: "What is the package description?",
				default: "",
			},
		],
		actions: [
			{
				type: "addMany",
				destination: "{{ turbo.paths.root }}/packages/{{ dashCase name }}",
				base: "templates/bun-package",
				templateFiles: "templates/bun-package/**",
			},
		],
	});

	plop.setGenerator("nuxt-app", {
		description: "Create a new Nuxt app in apps/<name>",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "What is the app folder name (under apps/)?",
				validate: (input: string) => {
					if (!input) return "name is required";
					if (input.includes(" ")) return "name cannot include spaces";
					if (input.includes("/")) return "name cannot include '/'";
					if (input.includes("\\")) return "name cannot include '\\'";
					return true;
				},
			},
			{
				type: "input",
				name: "description",
				message: "What is the app description?",
				default: "",
			},
		],
		actions: [
			{
				type: "addMany",
				destination: "{{ turbo.paths.root }}/apps/{{ dashCase name }}",
				base: "templates/nuxt-app",
				templateFiles: "templates/nuxt-app/**",
			},
		],
	});
}
