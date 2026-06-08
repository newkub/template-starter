import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TemplateRegistry } from "../src/services/registry.js";
import { createFixture, type Fixture } from "./fixtures.js";

describe("services/registry", () => {
	let fixture: Fixture;
	let registry: TemplateRegistry;

	beforeEach(async () => {
		fixture = await createFixture("registry-test");
		registry = new TemplateRegistry(fixture.root);
	});

	afterEach(async () => {
		await fixture.cleanup();
	});

	it("init creates root dir", async () => {
		await registry.init();
		const info = await Bun.file(registry.rootDir).stat().catch(() => null);
		expect(info?.isDirectory()).toBe(true);
	});

	it("list returns empty when nothing registered", async () => {
		await registry.init();
		const items = await registry.list();
		expect(items).toEqual([]);
	});

	it("addFromPath copies directory into registry", async () => {
		await registry.init();
		const source = join(fixture.root, "source");
		await mkdir(join(source, "lib"), { recursive: true });
		await writeFile(join(source, "README.md"), "# hi");
		await writeFile(join(source, "lib", "index.ts"), "export {}");

		const stored = await registry.addFromPath(source, "demo");
		expect(stored.endsWith("demo")).toBe(true);
		expect(await Bun.file(join(stored, "README.md")).text()).toBe("# hi");
		expect(await Bun.file(join(stored, "lib", "index.ts")).text()).toBe("export {}");
	});

	it("addFromPath throws when name already exists", async () => {
		await registry.init();
		const source = join(fixture.root, "source");
		await mkdir(source, { recursive: true });
		await writeFile(join(source, "a.txt"), "a");

		await registry.addFromPath(source, "demo");
		await expect(registry.addFromPath(source, "demo")).rejects.toThrow(/already exists/);
	});

	it("addFromPath throws when source does not exist", async () => {
		await registry.init();
		await expect(registry.addFromPath(join(fixture.root, "missing"), "x")).rejects.toThrow(/does not exist/);
	});

	it("remove deletes user template", async () => {
		await registry.init();
		const source = join(fixture.root, "source");
		await mkdir(source, { recursive: true });
		await writeFile(join(source, "a.txt"), "a");
		await registry.addFromPath(source, "demo");

		await registry.remove("demo");
		expect(await registry.has("demo")).toBe(false);
	});

	it("remove throws for unknown template", async () => {
		await registry.init();
		await expect(registry.remove("missing")).rejects.toThrow(/not found/);
	});

	it("list returns registered names sorted", async () => {
		await registry.init();
		for (const name of ["zeta", "alpha", "beta"]) {
			const source = join(fixture.root, name);
			await mkdir(source, { recursive: true });
			await writeFile(join(source, "x.txt"), "x");
			await registry.addFromPath(source, name);
		}
		const items = await registry.list();
		expect(items).toEqual(["alpha", "beta", "zeta"]);
	});
});
