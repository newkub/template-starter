import { defineConfig } from "tsdown";

const config: any = defineConfig({
	entry: ["src/extension.ts"],
	format: ["cjs"],
	target: "node18",
	minify: true,
	external: ["vscode"],
	dts: {
		sourcemap: true,
	},
	clean: true,
});

export default config;
