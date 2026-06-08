#!/usr/bin/env bun
import { buildProgram } from "./program.js";

const program = buildProgram();

try {
	program.parse(process.argv, { run: false });
	await program.runMatchedCommand();
} catch (error) {
	if (error instanceof Error) {
		console.error(`✗ ${error.message}`);
	} else {
		console.error(error);
	}
	process.exit(1);
}
