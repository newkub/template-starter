import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
	copyDirectory,
	describeDirectory,
	ensureDir,
	isDirectory,
	listDirectories,
	pathExists,
	relativeToCwd,
} from "../src/utils/fs.js";
import { createFixture, type Fixture } from "./fixtures.js";

describe("utils/fs", () => {
	let fixture: Fixture;

	beforeEach(async () => {
		fixture = await createFixture("fs-test");
	});

	afterEach(async () => {
		await fixture.cleanup();
	});

	describe("pathExists", () => {
		it("returns true for existing paths", async () => {
			const file = join(fixture.root, "exists.txt");
			await writeFile(file, "hi");
			expect(await pathExists(file)).toBe(true);
		});

		it("returns false for missing paths", async () => {
			expect(await pathExists(join(fixture.root, "nope.txt"))).toBe(false);
		});
	});

	describe("ensureDir", () => {
		it("creates nested directories", async () => {
			const nested = join(fixture.root, "a", "b", "c");
			await ensureDir(nested);
			expect(await isDirectory(nested)).toBe(true);
		});

		it("is idempotent", async () => {
			const nested = join(fixture.root, "x", "y");
			await ensureDir(nested);
			await ensureDir(nested);
			expect(await isDirectory(nested)).toBe(true);
		});
	});

	describe("listDirectories", () => {
		it("returns sorted directory names", async () => {
			await mkdir(join(fixture.root, "zeta"), { recursive: true });
			await mkdir(join(fixture.root, "alpha"), { recursive: true });
			await mkdir(join(fixture.root, "beta"), { recursive: true });
			await writeFile(join(fixture.root, "ignored.txt"), "x");

			const names = await listDirectories(fixture.root);
			expect(names).toEqual(["alpha", "beta", "zeta"]);
		});

		it("skips hidden directories", async () => {
			await mkdir(join(fixture.root, "visible"), { recursive: true });
			await mkdir(join(fixture.root, ".hidden"), { recursive: true });
			const names = await listDirectories(fixture.root);
			expect(names).toEqual(["visible"]);
		});

		it("returns empty array for missing directory", async () => {
			const names = await listDirectories(join(fixture.root, "nope"));
			expect(names).toEqual([]);
		});
	});

	describe("copyDirectory", () => {
		it("copies files and nested directories", async () => {
			const source = join(fixture.root, "src");
			await mkdir(join(source, "sub"), { recursive: true });
			await writeFile(join(source, "a.txt"), "hello");
			await writeFile(join(source, "sub", "b.txt"), "world");
			await writeFile(join(source, ".dotfile"), "skip");

			const destination = join(fixture.root, "dst");
			const result = await copyDirectory(source, destination);

			expect(result.files).toBe(2);
			expect(await Bun.file(join(destination, "a.txt")).text()).toBe("hello");
			expect(await Bun.file(join(destination, "sub", "b.txt")).text()).toBe("world");
			expect(await pathExists(join(destination, ".dotfile"))).toBe(false);
		});

		it("throws when destination exists and overwrite is false", async () => {
			const source = join(fixture.root, "src");
			await mkdir(source, { recursive: true });
			const destination = join(fixture.root, "dst");
			await mkdir(destination, { recursive: true });

			await expect(copyDirectory(source, destination)).rejects.toThrow(/already exists/);
		});

		it("overwrites destination when overwrite is true", async () => {
			const source = join(fixture.root, "src");
			await mkdir(source, { recursive: true });
			await writeFile(join(source, "fresh.txt"), "new");
			const destination = join(fixture.root, "dst");
			await mkdir(join(destination, "stale"), { recursive: true });
			await writeFile(join(destination, "stale.txt"), "old");

			const result = await copyDirectory(source, destination, { overwrite: true });
			expect(result.files).toBe(1);
			expect(await Bun.file(join(destination, "fresh.txt")).text()).toBe("new");
			expect(await pathExists(join(destination, "stale.txt"))).toBe(false);
		});

		it("throws when source does not exist", async () => {
			await expect(copyDirectory(join(fixture.root, "nope"), join(fixture.root, "dst"))).rejects.toThrow(
				/does not exist/,
			);
		});
	});

	describe("describeDirectory", () => {
		it("returns tree of files and directories", async () => {
			await mkdir(join(fixture.root, "src", "lib"), { recursive: true });
			await writeFile(join(fixture.root, "src", "index.ts"), "export {}");
			await writeFile(join(fixture.root, "src", "lib", "util.ts"), "export {}");

			const tree = await describeDirectory(fixture.root, 3);
			const src = tree.entries.find((e) => e.name === "src");
			expect(src?.type).toBe("directory");
			expect(src?.children?.entries.find((e) => e.name === "index.ts")?.type).toBe("file");
		});
	});

	describe("relativeToCwd", () => {
		it("returns '.' for cwd", () => {
			const result = relativeToCwd(process.cwd());
			expect(result === "." || result === "").toBe(true);
		});

		it("returns relative path", () => {
			const result = relativeToCwd(join(process.cwd(), "foo", "bar"));
			expect(result.endsWith("foo/bar") || result.endsWith("foo\\bar")).toBe(true);
		});
	});
});

describe("utils/errors", () => {
	it("TemplateNotFoundError formats name", async () => {
		const { TemplateNotFoundError } = await import("../src/utils/errors.js");
		const err = new TemplateNotFoundError("foo");
		expect(err.name).toBe("TemplateNotFoundError");
		expect(err.message).toBe('Template "foo" not found');
		expect(err).toBeInstanceOf(Error);
	});

	it("TemplateAlreadyExistsError formats name", async () => {
		const { TemplateAlreadyExistsError } = await import("../src/utils/errors.js");
		const err = new TemplateAlreadyExistsError("bar");
		expect(err.message).toBe('Template "bar" already exists');
	});

	it("PathNotFoundError formats path", async () => {
		const { PathNotFoundError } = await import("../src/utils/errors.js");
		const err = new PathNotFoundError("/nope");
		expect(err.message).toBe("Path not found: /nope");
	});
});

describe("utils/paths", () => {
	it("returns bundled templates dir inside package", async () => {
		const { getBundledTemplatesDir } = await import("../src/utils/paths.js");
		const dir = getBundledTemplatesDir();
		expect(dir).toContain("templates");
	});

	it("honours TEMPLATES_REGISTRY_DIR env override", async () => {
		const original = process.env.TEMPLATES_REGISTRY_DIR;
		const originalHome = process.env.TEMPLATES_HOME;
		try {
			process.env.TEMPLATES_REGISTRY_DIR = join(fixture.root, "custom");
			const { getUserRegistryDir } = await import("../src/utils/paths.js");
			const dir = getUserRegistryDir();
			expect(dir.endsWith("custom")).toBe(true);
		} finally {
			if (original === undefined) delete process.env.TEMPLATES_REGISTRY_DIR;
			else process.env.TEMPLATES_REGISTRY_DIR = original;
			if (originalHome === undefined) delete process.env.TEMPLATES_HOME;
			else process.env.TEMPLATES_HOME = originalHome;
		}
	});
});
