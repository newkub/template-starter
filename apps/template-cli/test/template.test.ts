import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TemplateService } from "../src/services/template.js";
import { TemplateNotFoundError } from "../src/utils/errors.js";
import { createFixture, type Fixture, makeTemplate } from "./fixtures.js";

describe("services/template", () => {
	let registryFixture: Fixture;
	let bundledFixture: Fixture;
	let service: TemplateService;
	let originalEnv: string | undefined;
	let originalHome: string | undefined;

	beforeEach(async () => {
		registryFixture = await createFixture("svc-reg");
		bundledFixture = await createFixture("svc-bundled");
		originalEnv = process.env.TEMPLATES_REGISTRY_DIR;
		originalHome = process.env.TEMPLATES_HOME;
		process.env.TEMPLATES_REGISTRY_DIR = registryFixture.root;

		// The service resolves bundled templates via the package's templates dir.
		// We override the package root by stubbing utils/paths via dynamic import & monkey patch.
		const paths = await import("../src/utils/paths.js");
		(paths as { getBundledTemplatesDir: () => string }).getBundledTemplatesDir = () => bundledFixture.root;
		(paths as { getBundledTemplatePath: (n: string) => string }).getBundledTemplatePath = (n: string) =>
			join(bundledFixture.root, n);

		const { TemplateRegistry } = await import("../src/services/registry.js");
		service = new TemplateService(new TemplateRegistry(registryFixture.root));
	});

	afterEach(async () => {
		await registryFixture.cleanup();
		await bundledFixture.cleanup();
		if (originalEnv === undefined) delete process.env.TEMPLATES_REGISTRY_DIR;
		else process.env.TEMPLATES_REGISTRY_DIR = originalEnv;
		if (originalHome === undefined) delete process.env.TEMPLATES_HOME;
		else process.env.TEMPLATES_HOME = originalHome;
	});

	describe("listTemplates", () => {
		it("returns bundled templates only when registry is empty", async () => {
			await makeTemplate(bundledFixture, { name: "alpha", files: { "index.ts": "export {}" } });
			await makeTemplate(bundledFixture, { name: "beta", files: { "index.ts": "export {}" } });

			const templates = await service.listTemplates();
			expect(templates.map((t) => t.name)).toEqual(["alpha", "beta"]);
			expect(templates.every((t) => t.source === "bundled")).toBe(true);
		});

		it("merges user and bundled, user wins on conflict", async () => {
			await makeTemplate(bundledFixture, { name: "shared", files: { "v.txt": "bundled" } });
			await makeTemplate(bundledFixture, { name: "only-bundled", files: { "v.txt": "b" } });

			const userSource = join(registryFixture.root, "user-src");
			await mkdir(userSource, { recursive: true });
			await writeFile(join(userSource, "v.txt"), "user");
			await service.addTemplate(userSource, "shared");
			await service.addTemplate(userSource, "only-user");

			const templates = await service.listTemplates();
			const names = templates.map((t) => t.name).sort();
			expect(names).toEqual(["only-bundled", "only-user", "shared"]);
			const shared = templates.find((t) => t.name === "shared");
			expect(shared?.source).toBe("user");
		});
	});

	describe("useTemplate", () => {
		it("copies bundled template to output", async () => {
			await makeTemplate(bundledFixture, {
				name: "starter",
				files: {
					"README.md": "# Starter",
					"src/index.ts": "export {}",
				},
			});

			const output = join(registryFixture.root, "out");
			const result = await service.useTemplate("starter", { output });
			expect(result.files).toBe(2);
			expect(await Bun.file(join(output, "README.md")).text()).toBe("# Starter");
			expect(await Bun.file(join(output, "src", "index.ts")).text()).toBe("export {}");
		});

		it("throws TemplateNotFoundError for missing templates", async () => {
			await expect(service.useTemplate("nope", { output: registryFixture.root })).rejects.toThrow(
				TemplateNotFoundError,
			);
		});

		it("overwrites destination when overwrite is true", async () => {
			await makeTemplate(bundledFixture, {
				name: "starter",
				files: { "a.txt": "new" },
			});
			const output = join(registryFixture.root, "out");
			await mkdir(output, { recursive: true });
			await writeFile(join(output, "stale.txt"), "stale");

			await service.useTemplate("starter", { output, overwrite: true });
			expect(await Bun.file(join(output, "a.txt")).text()).toBe("new");
			expect(await Bun.file(join(output, "stale.txt")).exists()).toBe(false);
		});
	});

	describe("viewTemplate", () => {
		it("returns template, metadata and tree", async () => {
			await makeTemplate(bundledFixture, {
				name: "starter",
				files: {
					"README.md": "# hi",
					"package.json": "{}",
					"src/index.ts": "export {}",
				},
			});

			const result = await service.viewTemplate("starter");
			expect(result.template.name).toBe("starter");
			expect(result.metadata.hasReadme).toBe(true);
			expect(result.metadata.hasPackageJson).toBe(true);
			expect(result.metadata.files).toBe(3);
			expect(result.tree.entries.find((e) => e.name === "src")?.type).toBe("directory");
		});

		it("throws TemplateNotFoundError for missing templates", async () => {
			await expect(service.viewTemplate("ghost")).rejects.toThrow(TemplateNotFoundError);
		});
	});

	describe("addTemplate", () => {
		it("adds external source as user template", async () => {
			const source = join(registryFixture.root, "external");
			await mkdir(source, { recursive: true });
			await writeFile(join(source, "x.txt"), "x");

			const result = await service.addTemplate(source, "external");
			expect(result.source).toBe("user");
			expect(result.name).toBe("external");
		});

		it("rejects duplicate names without force", async () => {
			const source = join(registryFixture.root, "external");
			await mkdir(source, { recursive: true });
			await writeFile(join(source, "x.txt"), "x");

			await service.addTemplate(source, "external");
			await expect(service.addTemplate(source, "external")).rejects.toThrow(/already exists/);
		});

		it("force replaces existing template", async () => {
			const source = join(registryFixture.root, "external");
			await mkdir(source, { recursive: true });
			await writeFile(join(source, "x.txt"), "v1");
			await service.addTemplate(source, "external");

			await writeFile(join(source, "x.txt"), "v2");
			await service.addTemplate(source, "external", { force: true });
			const stored = join(registryFixture.root, "external");
			expect(await Bun.file(join(stored, "x.txt")).text()).toBe("v2");
		});
	});

	describe("deleteTemplate", () => {
		it("removes user template", async () => {
			const source = join(registryFixture.root, "external");
			await mkdir(source, { recursive: true });
			await writeFile(join(source, "x.txt"), "x");
			await service.addTemplate(source, "external");

			await service.deleteTemplate("external");
			expect(await service.listTemplates({ includeUser: true })).not.toContainEqual(
				expect.objectContaining({ name: "external" }),
			);
		});

		it("refuses to delete bundled templates", async () => {
			await makeTemplate(bundledFixture, { name: "locked", files: { "a.txt": "a" } });
			await expect(service.deleteTemplate("locked")).rejects.toThrow(/bundled/);
		});

		it("throws TemplateNotFoundError for unknown name", async () => {
			await expect(service.deleteTemplate("ghost")).rejects.toThrow(TemplateNotFoundError);
		});
	});
});

describe("services/registry (cleanup)", () => {
	it("removes a previously created registry directory", async () => {
		const fx = await createFixture("reg-cleanup");
		const { TemplateRegistry } = await import("../src/services/registry.js");
		const reg = new TemplateRegistry(fx.root);
		await reg.init();
		await rm(fx.root, { recursive: true, force: true });
	});
});
