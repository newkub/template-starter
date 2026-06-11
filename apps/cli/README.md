# Template CLI

**A small, fast CLI to scaffold, inspect, and manage the templates in this monorepo**

The `templates` command reads the bundled templates from `templates/` in this repo, layers on any templates you have registered in your local registry, and lets you copy any of them into a target directory. It is a workspace of its own (`apps/cli`) and ships as a single binary named `templates`.

[![Bun](https://img.shields.io/badge/Bun-1.3.13+-fbf0df?logo=bun)](https://bun.sh)
[![cac](https://img.shields.io/badge/cac-6.7.14-blue?logo=typescript)](https://github.com/cacjs/cac)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:terminal.svg?color=%23818cf8" width="18" height="18"> | **One-Command Scaffold** | Copy any template into the current or chosen directory | Skip the manual copy/paste of starter files | `templates use <name>` |
| <img src="https://api.iconify.design/lucide:list.svg?color=%23f59e0b" width="18" height="18"> | **List and Filter** | Show every template with its source (bundled vs user) and path | See what is available without opening the repo | `templates list` |
| <img src="https://api.iconify.design/lucide:eye.svg?color=%236366f1" width="18" height="18"> | **Inspect Templates** | Print metadata and a directory tree before you copy | Verify you are using the right template | `templates view <name>` |
| <img src="https://api.iconify.design/lucide:folder-plus.svg?color=%2310b981" width="18" height="18"> | **Register Locally** | Add any local directory as a user template | Reuse your own starter projects | `templates add <path>` |
| <img src="https://api.iconify.design/lucide:trash-2.svg?color=%23ec4899" width="18" height="18"> | **Remove User Templates** | Delete a user template from the registry | Keep the registry tidy | `templates delete <name>` |
| <img src="https://api.iconify.design/lucide:json.svg?color=%238b5cf6" width="18" height="18"> | **JSON Output** | `--json` flag on list and view commands | Pipe output into scripts and tools | `templates list --json` |

---

## Key Concepts

> [!NOTE]
> Background on the design of the CLI

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:package.svg?color=%236366f1" width="18" height="18"> | **Two-Source Model** | Bundled templates (read-only, shipped with the package) and user templates (writable, in your local registry) |
| <img src="https://api.iconify.design/lucide:folder-tree.svg?color=%238b5cf6" width="18" height="18"> | **Layered Resolution** | `list` shows user templates first, then bundled; users can shadow a bundled template with their own |
| <img src="https://api.iconify.design/lucide:settings.svg?color=%2310b981" width="18" height="18"> | **Environment Overrides** | `TEMPLATES_REGISTRY_DIR` and `TEMPLATES_HOME` let you point the registry anywhere |
| <img src="https://api.iconify.design/lucide:copy.svg?color=%23f59e0b" width="18" height="18"> | **Recursive Copy** | `use` copies the full template tree, preserving nested directories and skipping hidden files |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Fast by Default** | No remote calls, no large dependencies; everything is local file operations |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Predictable Errors** | A small set of custom error classes (`TemplateNotFoundError`, `TemplateAlreadyExistsError`, `PathNotFoundError`, `PathAlreadyExistsError`, `RegistryError`) so callers can branch on type |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistent Layering** | Commands thin-wrap services; services own the rules; utils own the I/O |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documented Commands** | Every command has a description, options, and at least one test |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| Where do user templates live? | In the directory returned by `getUserRegistryDir()`. The default is `~/.templates`; override with `TEMPLATES_REGISTRY_DIR` or `TEMPLATES_HOME` |
| Can I delete a bundled template? | No. `delete` only operates on user templates. Bundled templates live inside the installed package |
| Does `use` overwrite existing files? | Only when you pass `--overwrite`; otherwise it errors with a clear message |
| Can I script the CLI? | Yes. `list --json` and `view --json` print machine-readable output |
| What is the file structure? | `src/main.ts` is the entry, `src/program.ts` builds the `cac` program, `src/commands/` holds one file per command, `src/services/` holds the business logic, and `src/utils/` holds the file-system and path helpers |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `templates list` first to confirm the name and source of a template before using it
- Use `templates view <name>` to check that the template has the files you expect
- Pass `--json` to integrate with other tools (CI, scripts, AI agents)
- Treat your registry as personal scratch space; the bundled templates are the stable ones

**For Maintainers**

- Keep commands thin: parse options, call the service, format output, set `process.exitCode` on failure
- Keep services free of I/O concerns: throw typed errors and let the command layer decide what to print
- Add a unit test in `test/` for every new service method and an integration test for every new command
- Re-run `bun run verify` before opening a PR; it runs typecheck, lint, and tests

</details>

---

## Quick Start

1. **Install dependencies for the workspace**
   ```bash
   cd apps/template-cli
   bun install
   ```

2. **Build the CLI**
   ```bash
   bun run build
   ```

3. **Install the binary globally** *(optional)*
   ```bash
   bun link
   ```

4. **List the templates that ship with this repo**
   ```bash
   templates list
   ```

5. **Scaffold a new project from a template**
   ```bash
   templates use bun-lib -o ./my-lib
   ```

---

## Usage

### CLI

The `templates` binary is the primary interface. Run it from anywhere once installed.

```bash
# Initialize a new project with smart detection (NEW)
templates init
templates init my-app

# Specify options explicitly
templates init my-app --framework next --database postgres

# Auto mode - no confirmation
templates init my-app --auto

# Dry run - see what would happen
templates init my-app --dry-run

# List every template, bundled and user
templates list

# Same list, machine-readable
templates list --json

# Filter to user-registered templates only
templates list --source user

# Show the metadata and file tree of one template
templates view bun-lib

# Same metadata, machine-readable
templates view bun-lib --json

# Copy a template into a new project
templates use bun-lib -o ./my-lib

# Overwrite an existing destination
templates use bun-lib -o ./my-lib --overwrite

# Register a local directory as a user template
templates add ./path/to/template --name my-template

# Replace an existing user template
templates add ./path/to/template --name my-template --force

# Remove a user template
templates delete my-template

# 'rm' works as an alias for 'delete'
templates rm my-template
```

### Programmatic API

The package also exports a programmatic API from `src/index.ts`. Import it from a TypeScript file or a Bun script:

```typescript
import {
	TemplateService,
	TemplateRegistry,
	buildProgram,
	getUserRegistryDir,
	copyDirectory,
} from "@templates/cli";

// Use the service directly
const service = new TemplateService(new TemplateRegistry("/custom/registry"));
const templates = await service.listTemplates();
console.log(templates.map((t) => t.name));

// Build a custom program with extra commands
const program = buildProgram({ version: "1.0.0" });
program.command("hello", "Say hi").action(() => console.log("hi"));
program.parse(process.argv);
```

### Library Consumers

The library re-exports the error classes, file-system helpers, and path helpers for any consumer that needs to embed template logic in a larger tool:

```typescript
import {
	TemplateNotFoundError,
	copyDirectory,
	getBundledTemplatesDir,
} from "@templates/cli";

try {
	await copyDirectory(getBundledTemplatesDir(), "./out");
} catch (err) {
	if (err instanceof TemplateNotFoundError) {
		// handle missing template
	}
	throw err;
}
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `src/main.ts` | CLI entry point. Builds the program and dispatches the matched command |
| `src/program.ts` | `buildProgram()` constructs the `cac` instance and registers every command |
| `src/commands/` | One file per subcommand: `list`, `use`, `view`, `add`, `delete` |
| `src/services/` | `TemplateService` (business logic) and `TemplateRegistry` (user template storage) |
| `src/utils/` | `fs.ts`, `paths.ts`, `errors.ts`, `ui.ts` — small, single-responsibility helpers |
| `src/types/` | Shared TypeScript types (`Template`, `UseOptions`, `AddOptions`, `ViewOptions`, `TemplateMetadata`) |
| `src/index.ts` | Library entry: re-exports the public surface for programmatic consumers |
| `test/` | `bun test` files: unit tests for utils and services, integration tests for commands |
| `biome.json` | Formatter and linter configuration |
| `bunup.config.ts` | Build configuration (entry points, output naming, DTS generation) |

### Commands

| Command | Arguments | Description |
|---------|-----------|-------------|
| `init` | `[name]` | Initialize a new project with smart detection |
| `list` | — | Print every available template, grouped by source |
| `use` | `<name>` | Copy a template into the current or `--output` directory |
| `view` | `<name>` | Print the template's metadata and a directory tree |
| `add` | `<source>` | Register a local directory as a user template |
| `delete` | `<name>` | Remove a user template from the registry (`rm` is an alias) |

### Options

| Option | Commands | Description | Default |
|--------|----------|-------------|---------|
| `-o, --output <path>` | `init`, `use` | Destination directory for the copy | `process.cwd()` |
| `--overwrite` | `use` | Replace the destination if it already exists | `false` |
| `-f, --framework <framework>` | `init` | Framework to use | detected |
| `-d, --database <database>` | `init` | Database to use | detected |
| `-a, --auth <auth>` | `init` | Authentication provider | detected |
| `-D, --deployment <deployment>` | `init` | Deployment target | detected |
| `--features <features>` | `init` | Features (comma-separated) | detected |
| `--auto` | `init` | Auto mode - no confirmation | `false` |
| `--interactive` | `init` | Force interactive mode | `false` |
| `--smart` | `init` | Smart detection mode | `true` |
| `--dry-run` | `init` | Show what would be done without doing it | `false` |
| `--preset <preset>` | `init` | Use a preset configuration | — |
| `--source <source>` | `list` | Show only `bundled`, `user`, or `all` templates | `all` |
| `--depth <n>` | `view` | Maximum directory depth to display | `2` |
| `--json` | `list`, `view` | Print machine-readable JSON instead of formatted text | `false` |
| `-n, --name <name>` | `add` | Override the registered template name | basename of `<source>` |
| `--force` | `add` | Replace an existing user template with the same name | `false` |
| `-h, --help` | all | Show usage for the command | — |
| `-v, --version` | root | Print the CLI version | — |

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `TEMPLATES_REGISTRY_DIR` | `~/.templates` (or `$TEMPLATES_HOME`) | Absolute path used as the user template registry |
| `TEMPLATES_HOME` | `~/.templates` | Fallback when `TEMPLATES_REGISTRY_DIR` is unset |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name (`@templates/cli`), `bin` entry, scripts, dependencies |
| `tsconfig.json` | Strict TypeScript with `bundler` module resolution, `bun` types, isolated declarations |
| `bunup.config.ts` | Bundles `src/main.ts` (CLI) and `src/index.ts` (library) into `dist/`, generates `.d.ts` for the library entry |
| `biome.json` | Lint and format rules (tab indent, double quotes, trailing commas) |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `bunx bunup --watch` | Rebuild the CLI on every change |
| `build` | `bunx bunup` | Produce the production bundle in `dist/` |
| `start` | `bun run src/main.ts` | Run the CLI from source without bundling |
| `format` | `biome format --write .` | Auto-format every file with Biome |
| `lint` | `biome lint .` | Lint the source and test trees |
| `typecheck` | `tsc --noEmit` | Type-check without producing output |
| `test` | `bun test` | Run the unit and integration tests |
| `verify` | `typecheck && lint && test` | Run the full quality gate |
| `ci` | `verify && build` | Run the full pipeline including the build |

---

## Notes

> [!TIP]
> `templates view <name> --json` is the fastest way to inspect a template from another script — it prints metadata, the source path, and a tree in a single payload.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs typecheck, lint, and the test suite in that order; failures will tell you which step to look at.

> [!WARNING]
> The user template directory is created on first use and is **not** committed. It lives in your home directory (or wherever `TEMPLATES_REGISTRY_DIR` points), so removing it does not affect the bundled templates.

> [!CAUTION]
> `templates delete` removes the template from your local registry. It will not delete files copied by a previous `use` — those remain wherever you copied them.
