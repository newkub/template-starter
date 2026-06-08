# Slidev Template

**A Slidev presentation template with Vue 3, Shiki, and the default and seriph themes**

A starting point for Markdown-based slide decks. The default `slides.md` is a Vue.js fundamentals workshop, the `package.json` declares `slidev` plus the `default` and `seriph` themes, and the standard `dev`/`build`/`export`/`lint`/`typecheck`/`test`/`verify` scripts are wired up to the monorepo task chain.

[![Slidev](https://img.shields.io/badge/Slidev-51.8.2-f8af00?logo=slidev)](https://sli.dev)
[![Vue](https://img.shields.io/badge/Vue-3.5.35-42b883?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:presentation.svg?color=%23f8af00" width="18" height="18"> | **Slidev** | Markdown-first slide framework | Write slides in Markdown, render in the browser | `bun run dev` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2342b883" width="18" height="18"> | **Vue 3** | Vue components inside slides | Use the full Vue ecosystem in your deck | `import { ref } from "vue"` |
| <img src="https://api.iconify.design/lucide:palette.svg?color=%238b5cf6" width="18" height="18"> | **Themes** | `default` and `seriph` themes pre-installed | Switch styles with one line of frontmatter | `theme: seriph` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Strict TypeScript** | TSGO type checking with `tsgo --noEmit` | Catch errors before publishing the deck | `bun run typecheck` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify any helpers you ship with the deck | `bun run test` |

---

## Key Concepts

> [!NOTE]
> How Slidev shapes a slide deck

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:file-text.svg?color=%236366f1" width="18" height="18"> | **Markdown-First** | Write slides in Markdown, mix in Vue components where you need them |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript for any custom components or composables |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **Component-Based** | Reusable layouts and components for consistent slide structure |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Live Editing** | The dev server hot-reloads slides as you type |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Shiki for highlighting, no heavy client-side framework beyond Vue |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | TypeScript for every helper and composable |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Slide content lives next to the code it documents |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Slidev? | A Vue-powered slide framework: slides are Markdown files rendered as a single-page app |
| How do I add code with highlighting? | Use a fenced code block with a language tag; Shiki highlights it automatically |
| Can I export to PDF or PNG? | Yes — `bun run export` produces a PDF using Playwright under the hood |
| How do I add speaker notes? | Add a `notes:` block to the slide frontmatter, or use HTML comments inside the slide |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use the built-in layouts (`cover`, `two-cols`, `quote`, `section`) for consistent structure
- Keep slides focused: one idea per slide, a few lines of body
- Use `v-click` to reveal content progressively during the talk

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep custom components in the `components/` directory
- Use TypeScript for any non-trivial helper or composable

</details>

---

## Quick Start

1. **Scaffold the deck into a fresh directory**
   ```bash
   templates use slidev -o ./my-talk
   cd my-talk
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the dev server**
   ```bash
   bun run dev
   ```

4. **Edit `slides.md`** and watch the browser update on every save

5. **Export to PDF** *(optional)*
   ```bash
   bun run export
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Start the dev server (default port 3030)
bun run dev

# Build a static SPA into dist/
bun run build

# Export to PDF (requires Playwright)
bun run export

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

### Slide Content

Each slide is a `---`-separated Markdown block. The first block carries global frontmatter:

```markdown
---
theme: seriph
layout: cover
background: https://example.com/bg.jpg
---

# Welcome to Slidev

The presentation tool for developers

<div v-click>

Next slide...

</div>
```

### Custom Components

Reusable Vue components live in the `components/` directory and are auto-imported by Slidev:

```vue
<!-- components/Counter.vue -->
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
	<button type="button" @click="count++">
		Count: {{ count }}
	</button>
</template>
```

Then drop `<Counter />` straight into a slide.

### Presenter Mode and Recording

- Press `p` in the browser to toggle presenter mode with notes and timer
- Press `f` for fullscreen
- Press `o` for an overview of all slides

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `slides.md` | Main slide deck source |
| `pages/` | Optional additional slide files (split a deck across files) |
| `components/` | Reusable Vue components (auto-imported) |
| `snippets/` | Reusable code snippets you can embed with `<Snippet/>` |
| `public/` | Static assets copied as-is into the build |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `bun run src/index.ts` | Start the Slidev dev server |
| `build` | `bun build` | Build the slide deck as a static SPA |
| `export` | `slidev export` | Export the deck to PDF (Playwright required) |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `typecheck` | `tsgo --noEmit` | Type-check the project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies, themes |
| `slides.md` | Deck content and global frontmatter (`theme`, `layout`, `background`) |
| `tsconfig.json` | Strict TypeScript settings |

### Themes

| Theme | Description |
|-------|-------------|
| `default` | Clean, light theme suitable for technical talks |
| `seriph` | Photo-friendly theme with serif typography |

Switch themes with the `theme` frontmatter on the first slide, or import additional themes with `bun add @slidev/theme-<name>`.

---

## Notes

> [!TIP]
> Press `p` in the dev server to open presenter mode with notes, timer, and a preview of the next slide.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `dist/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> `bun run export` runs Playwright under the hood. The first run downloads browser binaries, so budget extra time on a fresh machine.
