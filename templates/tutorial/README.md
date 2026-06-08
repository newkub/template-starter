# TutorialKit Starter

**An interactive tutorial platform with Astro, TutorialKit, and React**

A starting point for tutorial-style learning sites. The Astro app loads the TutorialKit integration, lessons are written in Markdown under `src/content/tutorial/`, and the dev server boots a web-based code editor plus terminal for each lesson.

[![Astro](https://img.shields.io/badge/Astro-6.4.2-ff5d01?logo=astro)](https://astro.build)
[![React](https://img.shields.io/badge/React-19.2.6-61dafb?logo=react)](https://react.dev)
[![TutorialKit](https://img.shields.io/badge/TutorialKit-1.6.0-1e88e5)](https://tutorialkit.dev)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23ff5d01" width="18" height="18"> | **Astro** | Content-first web framework | Fast static site with islands of interactivity | `bun run dev` |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **TutorialKit** | Astro integration for interactive lessons | Code editor, preview, and terminal per lesson | `src/content/tutorial/` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%238b5cf6" width="18" height="18"> | **Code Editor** | Web editor in every lesson | Readers can edit and run code in the browser | `_files/` |
| <img src="https://api.iconify.design/lucide:monitor.svg?color=%2310b981" width="18" height="18"> | **Live Preview** | Renders the lesson's work as you type | See the result without leaving the page | `previews` |
| <img src="https://api.iconify.design/lucide:terminal.svg?color=%23f97316" width="18" height="18"> | **Terminal** | Integrated terminal for each lesson | Run shell commands without leaving the browser | `mainCommand` |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%23333333" width="18" height="18"> | **UnoCSS** | Atomic CSS engine | Rapid styling without CSS files | `class="text-red-500"` |

---

## Key Concepts

> [!NOTE]
> How TutorialKit organises a tutorial

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:layout.svg?color=%236366f1" width="18" height="18"> | **Parts, Chapters, Lessons** | A three-level hierarchy that mirrors how courses are usually taught |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Metadata Inheritance** | Set a property on a chapter or part and every lesson below it inherits the value |
| <img src="https://api.iconify.design/lucide:file-text.svg?color=%2310b981" width="18" height="18"> | **Per-Lesson Files** | `_files/` ships the starting state, `_solution/` ships the answer |
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%23f59e0b" width="18" height="18"> | **Command Execution** | `prepareCommands` and `mainCommand` automate setup and the primary lesson flow |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Astro ships only the JS the lesson needs |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Strict TypeScript for the Astro and React sides |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Content lives next to the configuration it documents |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is TutorialKit? | An Astro integration that turns Markdown lessons into interactive courses with a code editor, preview, and terminal |
| How do I add a lesson? | Create `src/content/tutorial/<part>/<chapter>/<lesson>/content.md` plus optional `_files/` and `_solution/` |
| How do I run commands for the reader? | Add `prepareCommands` to the lesson metadata for setup steps and `mainCommand` for the main entry point |
| Can I use MDX? | Yes — both Markdown (`.md`) and MDX (`.mdx`) are supported by the content collection |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use metadata inheritance to keep configuration DRY — set `previews` once at the part or chapter level
- Provide both `_files/` and `_solution/` for every lesson so readers have a starting point and a target
- Test `prepareCommands` and `mainCommand` locally before publishing the lesson

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep parts and chapters short — a long course is harder to navigate than a deep one
- Document any non-obvious command in the lesson's prose

</details>

---

## Quick Start

1. **Scaffold the tutorial into a fresh directory**
   ```bash
   templates use tutorial -o ./my-tutorial
   cd my-tutorial
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the dev server** (default port 4321)
   ```bash
   bun run dev
   ```

4. **Author your first lesson** by creating a folder under `src/content/tutorial/<part>/<chapter>/`
   ```bash
   mkdir -p src/content/tutorial/1-basics/1-introduction/1-welcome
   ```

5. **Add the lesson files**
   ```bash
   # content.md     — the lesson body
   # _files/        — initial files
   # _solution/     — solution files
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Start the Astro dev server (default port 4321)
bun run dev

# Build the static site
bun run build

# Preview the production build
bun run preview

# Run the Astro CLI directly
bun run astro --help

# Lint the source tree
bun run lint

# Format the source tree
bun run format

# Type-check the project
bun run typecheck

# Run the Vitest suite
bun run test

# Run lint, typecheck, and tests together
bun run verify

# Run the full CI pipeline
bun run ci

# Scan for code patterns with ast-grep
bun run scan
```

### Authoring Content

A tutorial is a tree of parts, chapters, and lessons. Each level carries a `meta.md` with its title and optional metadata:

```
tutorial/
├── 1-basics/             # Part 1: Basics
│   ├── meta.md
│   ├── 1-introduction/   # Chapter 1: Introduction
│   │   ├── meta.md
│   │   ├── 1-welcome/    # Lesson 1: Welcome
│   │   │   ├── content.md
│   │   │   ├── _files/
│   │   │   └── _solution/
│   │   └── 2-getting-started/
│   │       ├── content.md
│   │       ├── _files/
│   │       └── _solution/
│   └── 2-advanced/
├── 2-cli/                # Part 2: CLI
│   ├── meta.md
│   └── ...
└── meta.md
```

### Lesson Structure

A lesson has three top-level pieces:

| Path | Required | Purpose |
|------|----------|---------|
| `content.md` | yes | The lesson body in Markdown (or `.mdx`) |
| `_files/` | no | Starting state shown in the editor |
| `_solution/` | no | Reference solution the reader can compare against |

### Lesson Frontmatter

The schema is defined by `@tutorialkit/types` and exported as `contentSchema`:

```markdown
---
type: lesson
title: Welcome!
slug: welcome
previews:
  - port: 3000
    title: App
autoReload: true
prepareCommands:
  - command: npm install
mainCommand: npm run dev
---

# Welcome to TutorialKit!

In this lesson we'll walk you through setting up your environment.
```

### Layout

TutorialKit ships a three-pane layout — content, code editor, and a stack of preview plus terminal. The reader can resize each pane.

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `src/content/tutorial/` | Tutorial content (parts, chapters, lessons) |
| `src/content/tutorial/<part>/meta.md` | Part metadata and title |
| `src/content/tutorial/<part>/<chapter>/meta.md` | Chapter metadata and title |
| `src/content/tutorial/<part>/<chapter>/<lesson>/` | Lesson files |
| `src/content/tutorial/<part>/<chapter>/<lesson>/content.md` | Lesson body |
| `src/content/tutorial/<part>/<chapter>/<lesson>/_files/` | Initial files |
| `src/content/tutorial/<part>/<chapter>/<lesson>/_solution/` | Solution files |
| `src/templates/` | UI templates the editor uses as a starting point |
| `src/content/config.ts` | Content collection schema |
| `public/` | Favicon, logo, and other static assets |
| `icons/languages/` | Language icons shown in the editor's file tree |
| `astro.config.ts` | Astro configuration and TutorialKit integration |
| `uno.config.ts` | UnoCSS configuration |

### Content Schema

| Property | Required | Type | Inherited | Description |
|----------|----------|------|-----------|-------------|
| `type` | yes | `"part" \| "chapter" \| "lesson"` | no | The kind of entry this `meta.md` describes |
| `title` | yes | `string` | no | The title shown in the navigation |
| `slug` | no | `string` | no | Override the URL path |
| `previews` | no | `Preview[]` | yes | Preview port configuration |
| `autoReload` | no | `boolean` | yes | Always reload the preview on file change |
| `prepareCommands` | no | `Command[]` | yes | Setup commands run before the lesson starts |
| `mainCommand` | no | `Command` | yes | The primary command run when the lesson begins |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `bun run src/index.ts` | Start the Astro dev server |
| `build` | `bun build` | Build the static site |
| `preview` | `astro preview` | Preview the production build |
| `start` | `astro dev` | Start the dev server (alternate entry) |
| `astro` | `astro` | Delegate to the Astro CLI |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `typecheck` | `tsgo --noEmit` | Type-check the project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |
| `postbuild` | `cp _headers ./dist/` | Copy Cloudflare-style headers after build |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies |
| `astro.config.ts` | Astro configuration and TutorialKit integration |
| `uno.config.ts` | UnoCSS configuration (presets, shortcuts, theme) |
| `tsconfig.json` | Strict TypeScript settings |
| `_headers` | HTTP headers copied to the build output (Cloudflare Pages) |

---

## Notes

> [!TIP]
> Use metadata inheritance to keep configuration DRY. Set `previews`, `prepareCommands`, or `mainCommand` once at a part or chapter and every lesson below it will inherit the value.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules`, `dist/`, or anything inside `.astro/`. They are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Test `prepareCommands` and `mainCommand` locally before publishing the lesson — a broken command blocks the reader from progressing.
