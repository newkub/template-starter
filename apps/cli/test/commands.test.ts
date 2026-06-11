import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { listCommand } from "../src/commands/list.js";
import { useCommand } from "../src/commands/use.js";
import { viewCommand } from "../src/commands/view.js";
import { addCommand } from "../src/commands/add.js";
import { deleteCommand } from "../src/commands/delete.js";
import { buildProgram } from "../src/program.js";
import { createFixture, type Fixture, makeTemplate } from "./fixtures.js";

describe("program (cac)", () => {
	let fixture: Fixture;
	let bundledFixture: Fixture;
	let originalEnv: string | undefined;
	let originalHome: string | undefined;
	let originalCwd: string;
	let originalExit: typeof process.exit;

	beforeEach(async () => {
		fixture = await createFixture("prog-reg");
		bundledFixture = await createFixture("prog-bundled");
		originalEnv = process.env.TEMPLATES_REGISTRY_DIR;
		originalHome = process.env.TEMPLATES_HOME;
		process.env.TEMPLATES_REGISTRY_DIR = fixture.root;
		originalCwd = process.cwd();
		originalExit = process.exit;

		const paths = await import("../src/utils/paths.js");
		(paths as { getBundledTemplatesDir: () => string }).getBundledTemplatesDir = () => bundledFixture.root;
		(paths as { getBundledTemplatePath: (n: string) => string }).getBundledTemplatePath = (n: string) =>
			join(bundledFixture.root, n);

		(process as { exit: typeof process.exit }).exit = (() => {
			// swallow
		}) as typeof process.exit;
	});

	afterEach(async () => {
		await fixture.cleanup();
		await bundledFixture.cleanup();
		if (originalEnv === undefined) delete process.env.TEMPLATES_REGISTRY_DIR;
		else process.env.TEMPLATES_REGISTRY_DIR = originalEnv;
		if (originalHome === undefined) delete process.env.TEMPLATES_HOME;
		else process.env.TEMPLATES_HOME = originalHome;
		process.chdir(originalCwd);
		(process as { exit: typeof process.exit }).exit = originalExit;
	});

	it("builds a cac program with all commands", () => {
		const program = buildProgram();
		const commands = program.commands.map((c) => c.name);
		expect(commands).toContain("list");
		expect(commands).toContain("use");
		expect(commands).toContain("view");
		expect(commands).toContain("add");
		expect(commands).toContain("delete");
	});
});

describe("commands", () => {
	let fixture: Fixture;
	let bundledFixture: Fixture;
	let originalEnv: string | undefined;
	let originalHome: string | undefined;
	let originalCwd: string;
	let logs: string[];
	let errors: string[];
	let originalLog: typeof console.log;
	let originalErr: typeof console.error;

	beforeEach(async () => {
		fixture = await createFixture("cmd-reg");
		bundledFixture = await createFixture("cmd-bundled");
		originalEnv = process.env.TEMPLATES_REGISTRY_DIR;
		originalHome = process.env.TEMPLATES_HOME;
		process.env.TEMPLATES_REGISTRY_DIR = fixture.root;
		originalCwd = process.cwd();
		logs = [];
		errors = [];
		originalLog = console.log;
		originalErr = console.error;
		console.log = (...args: unknown[]) => logs.push(args.map(String).join(" "));
		console.error = (...args: unknown[]) => errors.push(args.map(String).join(" "));

		const paths = await import("../src/utils/paths.js");
		(paths as { getBundledTemplatesDir: () => string }).getBundledTemplatesDir = () => bundledFixture.root;
		(paths as { getBundledTemplatePath: (n: string) => string }).getBundledTemplatePath = (n: string) =>
			join(bundledFixture.root, n);
	});

	afterEach(async () => {
		await fixture.cleanup();
		await bundledFixture.cleanup();
		if (originalEnv === undefined) delete process.env.TEMPLATES_REGISTRY_DIR;
		else process.env.TEMPLATES_REGISTRY_DIR = originalEnv;
		if (originalHome === undefined) delete process.env.TEMPLATES_HOME;
		else process.env.TEMPLATES_HOME = originalHome;
		process.chdir(originalCwd);
		console.log = originalLog;
		console.error = originalErr;
	});

	it("list command prints bundled templates", async () => {
		await makeTemplate(bundledFixture, { name: "starter", files: { "index.ts": "export {}" } });
		await listCommand();
		const out = logs.join("\n");
		expect(out).toContain("starter");
		expect(out).toContain("[bundled]");
	});

	it("list command supports --json", async () => {
		await makeTemplate(bundledFixture, { name: "starter", files: { "index.ts": "export {}" } });
		await listCommand({ json: true });
		const payload = logs.join("\n");
		const parsed = JSON.parse(payload) as Array<{ name: string; source: string }>;
		expect(parsed.find((t) => t.name === "starter")?.source).toBe("bundled");
	});

	it("use command copies template to cwd", async () => {
		await makeTemplate(bundledFixture, {
			name: "starter",
			files: { "a.txt": "hi", "b/c.txt": "deep" },
		});
		const work = join(fixture.root, "work");
		await mkdir(work, { recursive: true });
		process.chdir(work);

		const exitCode = (process.exitCode = 0);
		await useCommand("starter");
		expect(process.exitCode ?? 0).toBe(0);
		expect(await Bun.file(join(work, "a.txt")).text()).toBe("hi");
		expect(await Bun.file(join(work, "b", "c.txt")).text()).toBe("deep");
		process.exitCode = exitCode;
	});

	it("use command sets exit code 1 on missing template", async () => {
		process.exitCode = 0;
		await useCommand("ghost");
		expect(process.exitCode).toBe(1);
		process.exitCode = 0;
	});

	it("view command prints details", async () => {
		await makeTemplate(bundledFixture, {
			name: "starter",
			files: { "README.md": "# hi", "package.json": "{}" },
		});
		await viewCommand("starter");
		const out = logs.join("\n");
		expect(out).toContain("Template: starter");
		expect(out).toContain("README");
	});

	it("view command supports --json", async () => {
		await makeTemplate(bundledFixture, { name: "starter", files: { "a.txt": "x" } });
		await viewCommand("starter", { json: true });
		const parsed = JSON.parse(logs.join("\n")) as { template: { name: string } };
		expect(parsed.template.name).toBe("starter");
	});

	it("add command registers source", async () => {
		const source = join(fixture.root, "src");
		await mkdir(source, { recursive: true });
		await writeFile(join(source, "a.txt"), "x");

		process.exitCode = 0;
		await addCommand(source, { name: "demo" });
		expect(process.exitCode ?? 0).toBe(0);
		expect(await Bun.file(join(fixture.root, "demo", "a.txt")).text()).toBe("x");
	});

	it("add command errors when source missing", async () => {
		process.exitCode = 0;
		await addCommand(join(fixture.root, "missing"));
		expect(process.exitCode).toBe(1);
		process.exitCode = 0;
	});

	it("delete command removes user template", async () => {
		const source = join(fixture.root, "src");
		await mkdir(source, { recursive: true });
		await writeFile(join(source, "a.txt"), "x");
		await addCommand(source, { name: "demo" });

		process.exitCode = 0;
		await deleteCommand("demo");
		expect(process.exitCode ?? 0).toBe(0);
		expect(await Bun.file(join(fixture.root, "demo", "a.txt")).exists()).toBe(false);
	});

	it("delete command errors when template is missing", async () => {
		process.exitCode = 0;
		await deleteCommand("ghost");
		expect(process.exitCode).toBe(1);
		process.exitCode = 0;
	});
});
