# Templates

**A production-ready monorepo of project templates and the CLI that scaffolds them**

This repository hosts a curated collection of 15 project templates (web apps, libraries, microservices, desktop, browser/editor extensions, presentations, and documentation sites) plus a small CLI that copies any template into a target directory. All workspaces share one task pipeline defined in `.moon/tasks/all.yml`, so format, lint, typecheck, test, and build behave the same way everywhere.

[![Bun](https://img.shields.io/badge/Bun-1.3.13+-fbf0df?logo=bun)](https://bun.sh)
[![Moonrepo](https://img.shields.io/badge/Moonrepo-2.2.6-blue?logo=moonrepo)](https://moonrepo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:layers.svg?color=%23818cf8" width="18" height="18"> | **Monorepo Architecture** | Bun workspaces orchestrated by Moonrepo | One toolchain, one task graph, every project | `moon run <task>` |
| <img src="https://api.iconify.design/lucide:terminal.svg?color=%23f59e0b" width="18" height="18"> | **Template CLI** | A `templates` command that lists, views, uses, adds, and removes templates | Scaffold a new project in one command | `bunx @templates/template-cli use <name>` |
| <img src="https://api.iconify.design/lucide:zap.svg?color=%236366f1" width="18" height="18"> | **Affected Tasks** | Moonrepo hashes inputs and caches outputs | Only changed projects run when you say `--affected` | `moon run build --affected` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Quality Gate** | Format → lint → typecheck → test → build, in that order | Catch issues before they leave your machine | `moon run verify` |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23ec4899" width="18" height="18"> | **VCS Hooks** | Pre-commit runs lint/format on staged files, pre-push runs typecheck/test | No more pushing broken code | `bun run prepare` |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%238b5cf6" width="18" height="18"> | **15 Templates** | Bun/Node libs, Next/Nuxt/Vite/VitePress apps, Rust packages, microservices, extensions, Slidev, Tauri | Start with the shape that fits your use case | `bunx @templates/template-cli list` |

---

## Key Concepts

> [!NOTE]
> Background on the design choices behind this template collection

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:database.svg?color=%236366f1" width="18" height="18"> | **Workspace Orchestration** | Moonrepo discovers every workspace under `apps/*` and `templates/*` and runs tasks across them |
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%238b5cf6" width="18" height="18"> | **Task Caching** | Inputs are hashed, outputs are stored, and unchanged tasks are skipped on the next run |
| <img src="https://api.iconify.design/lucide:git-commit.svg?color=%2310b981" width="18" height="18"> | **Affected Tasks** | The `--affected` flag scopes work to projects changed since the base branch |
| <img src="https://api.iconify.design/lucide:settings.svg?color=%23f59e0b" width="18" height="18"> | **Toolchain Pinning** | `.moon/toolchains.yml` pins Node 22.11.0 and Bun 1.1.38 for the whole workspace |
| <img src="https://api.iconify.design/lucide:file-code.svg?color=%23ec4899" width="18" height="18"> | **Shared Task Graph** | `.moon/tasks/all.yml` defines one task chain reused by every workspace |
| <img src="https://api.iconify.design/lucide:workflow.svg?color=%23818cf8" width="18" height="18"> | **Task Dependencies** | Tasks declare `dependsOn` so format always runs before lint, lint before typecheck, and so on |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Cache hits make repeat builds 10x faster; `--affected` keeps CI lean |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Quality Gates** | A single `moon run verify` runs the entire quality chain end to end |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts, same task names, same options across every workspace |
| <img src="https://api.iconify.design/lucide:sliders.svg?color=%238b5cf6" width="18" height="18"> | **Flexibility** | A workspace can extend the shared task graph in its own `moon.yml` |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Each workspace ships its own README with real commands and examples |
| <img src="https://api.iconify.design/lucide:users.svg?color=%23818cf8" width="18" height="18"> | **Team Collaboration** | Hooks enforce the same standards on every contributor's machine |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Moonrepo? | A task orchestrator that runs and caches tasks across a polyglot monorepo |
| Where are the templates? | In `templates/<name>/`; each one is its own workspace with its own `package.json` |
| How do I add a new template? | Drop a directory under `templates/` with a `package.json` exposing the shared task names |
| Can I use a template outside this repo? | Yes, use the CLI: `bunx @templates/template-cli use <name>` copies it into any directory |
| How does caching work? | Moonrepo hashes declared inputs and skips tasks whose inputs and outputs are unchanged |
| What if a task fails? | Re-run with `moon run <task> --verbose` to see the underlying command output |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Always run `moon check` after editing `.moon/*.yml` to validate workspace configuration
- Use `moon run build --affected` to rebuild only the workspaces you touched
- Keep `bun.lock` committed so the whole team resolves the same dependency graph
- Use the CLI's `use <name>` rather than copying template folders by hand
- Read the template-specific README before customising a workspace

**For Maintainers**

- Follow the task chain order: `format` → `lint` → `typecheck` → `test` → `build`
- Mark long-running dev servers with `persistent: true` in the task definition
- Mark pure CPU tasks with `cache: true` so the cache does its job
- Keep `moon.yml` per project small — extend the shared graph, do not redefine it

</details>

---

## Quick Start

Get the monorepo and CLI ready in five steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/wrikka/templates.git
   cd templates
   ```

2. **Install dependencies for every workspace**
   ```bash
   bun install
   ```

3. **Install the Git hooks**
   ```bash
   bun run prepare
   ```

4. **Verify the workspace is healthy**
   ```bash
   moon check
   ```

5. **Run a task across the whole monorepo**
   ```bash
   moon run :typecheck
   ```

---

## Usage

### CLI

The `templates` command comes from `apps/cli`. It runs against the bundled templates in `templates/` plus any templates you have registered into your local registry (`~/.templates` by default, override with `TEMPLATES_REGISTRY_DIR`).

```bash
# Show every template, bundled and user-registered
bunx @templates/cli list

# Show the contents and metadata of one template
bunx @templates/cli view <name>

# Copy a template into a new project directory
bunx @templates/cli use <name> -o ./my-app

# Register a local directory as a user template
bunx @templates/cli add ./path/to/template --name my-template

# Remove a user template
bunx @templates/cli delete my-template
```

### Moonrepo CLI

Run any shared task across one project, many projects, or every project:

```bash
# Type-check every workspace
moon run :typecheck

# Build one workspace
moon run templates/bun-lib:build

# Test only the workspaces affected by your branch
moon run test --affected

# Inspect the full task graph
moon run :build --dry-run

# Validate the workspace configuration
moon check

# Run the CI pipeline end to end
moon ci
```

### Git Integration

Hooks are installed by `bun run prepare` and declared in `.moon/workspace.yml`. They run on every commit and push, scoped to the projects you have changed:

```bash
# Inspect installed hooks
cat .git/hooks/pre-commit
cat .git/hooks/pre-push

# Trigger the pre-commit hook manually
moon run :lint :format --affected --status=staged

# Trigger the pre-push hook manually
moon run :typecheck :test --affected
```

---

## Reference

### Workspaces

| Workspace | Path | Type | Used For |
|-----------|------|------|----------|
| `cli` | `apps/cli` | Bun CLI | Scaffold, list, and manage templates |
| `bun-lib` | `templates/bun-lib` | Bun library | Publishable TypeScript packages with Effect + Zod |
| `node-lib` | `templates/node-lib` | Node library | Engines-pinned Node 18+ libraries |
| `next` | `templates/next` | Next.js 15 app | React 19 web apps with App Router and Turbopack |
| `nuxt` | `templates/nuxt` | Nuxt 4 app | Vue 3 full-stack apps with UnoCSS and Pinia |
| `vite-react` | `templates/vite-react` | Vite + React app | Hybrid SSR/SSG via AnalogJS Nitro |
| `vitepress` | `templates/vitepress` | VitePress site | Documentation with Clerk auth and Monaco editor |
| `slidev` | `templates/slidev` | Slidev deck | Markdown-based presentations |
| `tutorial` | `templates/tutorial` | TutorialKit site | Interactive lessons with code editor and terminal |
| `tauri-nuxt` | `templates/tauri-nuxt` | Tauri desktop app | Cross-platform desktop with Rust backend |
| `web-extension-wxt-nuxt` | `templates/web-extension-wxt-nuxt` | WXT extension | Cross-browser extensions with Vue 3 |
| `vscode-vue` | `templates/vscode-vue` | VS Code extension | Reactive VS Code extensions with Tsdown |
| `moonrepo` | `templates/moonrepo` | Moonrepo monorepo | Microservices with shared packages |
| `turborepo` | `templates/turborepo` | Turborepo monorepo | Multi-app monorepo with shared `packages/` |
| `rust-clean` | `templates/rust-clean` | Rust library | Clean Architecture with Vertical Slice |
| `rust-layered` | `templates/rust-layered` | Rust library | Layered Architecture for medium-scale systems |

### Shared Tasks

Defined in `.moon/tasks/all.yml` and reused by every workspace:

| Task | Purpose | Depends On | Cacheable |
|------|---------|------------|-----------|
| `prepare` | Install dependencies (`bun install`) | — | no |
| `format` | Format the source tree | — | yes |
| `lint` | Lint the source tree | `format` | no |
| `typecheck` | Type-check the project | `lint` | yes |
| `test` | Run unit tests | `lint` | yes |
| `build` | Produce production artefacts | `lint` | yes |
| `verify` | Run `typecheck` + `test` together | `test` | no |
| `dev` | Start a long-running dev server | — | no (persistent) |
| `watch` | Watch for file changes | — | no (persistent) |

### Configuration

| File | Purpose | Location |
|------|---------|----------|
| `package.json` | Workspace list and root scripts | `./package.json` |
| `workspace.yml` | Workspace projects and VCS hooks | `.moon/workspace.yml` |
| `toolchains.yml` | Pinned Node and Bun versions | `.moon/toolchains.yml` |
| `all.yml` | Shared task definitions | `.moon/tasks/all.yml` |
| `moon.yml` | Per-project task overrides | Each workspace root |

### Moonrepo Options

| Option | Description | Example |
|--------|-------------|---------|
| `--affected` | Run the task only on projects changed since the base branch | `moon run build --affected` |
| `--verbose` | Print every shell command before it runs | `moon run test --verbose` |
| `--dry-run` | Show what would run without executing anything | `moon run build --dry-run` |
| `--force` | Ignore the task cache and re-run everything | `moon run build --force` |
| `--status=staged` | Scope `--affected` to the files currently staged in Git | `moon run lint --affected --status=staged` |

### Commands

**Workspace**

```bash
# Validate the workspace configuration
moon check

# Install Git hooks from the workspace config
moon sync

# Run the CI pipeline
moon ci

# List every discovered project
moon project list

# Show one project's metadata
moon project info templates/bun-lib
```

**Tasks**

```bash
# Run a task on every project
moon run :build

# Run a task on one project
moon run templates/next:dev

# Run several tasks in sequence
moon run :format :lint
```

**Development**

```bash
# Start a dev server (workspace-dependent)
moon run dev

# Watch for file changes
moon run watch

# Build production artefacts
moon run build
```

### Environment Variables

| Variable | Default | Used By |
|----------|---------|---------|
| `TEMPLATES_REGISTRY_DIR` | `~/.templates` | `template-cli` user template directory |
| `TEMPLATES_HOME` | `$HOME/.templates` | Fallback when `TEMPLATES_REGISTRY_DIR` is unset |
| `NODE_ENV` | — | Workspace scripts that read it (e.g. Nuxt, Next) |
| `BUN_INSTALL` | toolchain default | Resolved by Bun at install time |

---

## Notes

> [!TIP]
> Use `moon run build --affected` for everyday work — cache hits make repeat builds almost instant.

> [!IMPORTANT]
> Run `moon check` after editing anything under `.moon/`. It validates the workspace config before you commit a broken `moon.yml`.

> [!WARNING]
> Never commit the contents of `.moon/cache/`. It is reproducible build state and is already covered by `.gitignore`.

> [!CAUTION]
> Be careful with `moon run <task> --force` — it bypasses the cache and will re-run every task in the chain, which can be slow on a cold cache.
