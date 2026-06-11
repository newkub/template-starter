import { defineConfig } from "bunup";

export default defineConfig({
	entry: ["./src/main.ts", "./src/index.ts"],
	name: "template-cli",
	format: ["esm"],
	target: "bun",
	dts: {
		entry: ["./src/index.ts"],
		splitting: true,
	},
});
