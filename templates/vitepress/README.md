# VitePress Documentation Template

**A VitePress documentation site with Clerk authentication, Supabase, Monaco editor, and UnoCSS**

A starting point for documentation sites that need authentication, interactive code samples, and a blog. VitePress 1 powers the site, UnoCSS handles styling, and the Clerk Vue SDK is pre-wired for sign-in flows. Content lives as Markdown in `docs/` and `blog/`.

[![VitePress](https://img.shields.io/badge/VitePress-1.6.4-647c83?logo=vite)](https://vitepress.dev)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:file-text.svg?color=%23647c83" width="18" height="18"> | **VitePress** | Vue-powered static site generator | Fast, SEO-friendly docs with full Vue interop | `bun dev` |
| <img src="https://api.iconify.design/lucide:lock.svg?color=%23f97316" width="18" height="18"> | **Clerk** | Drop-in authentication via `@clerk/vue` | Sign-in and sign-out flows without writing the boilerplate | `.env` |
| <img src="https://api.iconify.design/lucide:database.svg?color=%2310b981" width="18" height="18"> | **Supabase** | Postgres + auth + storage client | Wire to a managed backend in a few lines | `.env` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Monaco Editor** | The editor that powers VS Code, in your docs | Live code editing inside Markdown | Custom component |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%238b5cf6" width="18" height="18"> | **UnoCSS** | Atomic CSS engine | Rapid styling without CSS files | `class="text-red-500"` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2342b883" width="18" height="18"> | **Vue 3** | Progressive JavaScript framework | Reactive UI development | `import { ref } from "vue"` |

---

## Key Concepts

> [!NOTE]
> How the VitePress theme extends Markdown

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Static Site Generation** | Fast, SEO-friendly documentation |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript across pages, components, and configs |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **File-Based Routing** | Markdown files in `docs/` and `blog/` become pages automatically |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Component System** | Reusable Vue components in Markdown via `<ComponentName />` |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Static HTML plus minimal JS keeps first-paint fast |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | `bun run typecheck` covers pages, components, and the VitePress config |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Markdown is the source of truth, components extend it where needed |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is VitePress? | A Vue-powered static site generator designed for documentation; pages are Markdown files |
| How do I add a new page? | Drop a Markdown file in `docs/` (or `blog/`); the route is created from the file path |
| How do I add Clerk auth? | Set the Clerk keys in `.env` (see `.env.example`) and use the `<SignIn />` and `<UserButton />` components |
| How do I deploy? | The build output is a static site; deploy to Vercel, Cloudflare Pages, Netlify, or GitHub Pages |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use Markdown for prose, drop a Vue component in for interactivity
- Organise content with clear folder structure (`docs/getting-started/`, `docs/guides/`, …)
- Use Mermaid diagrams for visual explanations (the `vitepress-plugin-mermaid` plugin is wired up)
- Test authentication flows locally with Clerk's dev keys before deploying

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep components small and focused
- Use UnoCSS for styling so you do not have to ship a CSS file

</details>

---

## Quick Start

1. **Scaffold the site into a fresh directory**
   ```bash
   templates use vitepress -o ./my-docs
   cd my-docs
   ```

2. **Install Git hooks and dependencies**
   ```bash
   bun run prepare
   bun install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # fill in CLERK_*, SUPABASE_*, STRIPE_* keys as needed
   ```

4. **Start the dev server** (default port 5173)
   ```bash
   bun dev
   ```

5. **Build the static site**
   ```bash
   bun build
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Install Git hooks (one-time)
bun run prepare

# Start the VitePress dev server (default port 5173)
bun dev

# Build a static site into .vitepress/dist
bun build

# Preview the static build locally
bun preview

# Watch the docs directory
bun run watch

# Lint the source tree
bun lint

# Format the source tree
bun format

# Type-check the project
bun run typecheck

# Run the Bun test suite
bun run test

# Run the full quality gate (oxlint, tsc, vue-tsc, knip)
bun run check

# Run lint, typecheck, and tests together
bun run verify

# Audit unused dependencies
bun knip

# Scan for code patterns with ast-grep
bun run scan
```

### Markdown Content

Add a Markdown file under `docs/` and it becomes a route automatically. Frontmatter is optional but useful for ordering and titles:

```markdown
---
title: Getting Started
order: 1
---

# Getting Started

Content goes here with **markdown** formatting.

## Code Blocks

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Interactive Components

<MonacoEditor src="./snippets/example.ts" />
```

### Vue Components in Markdown

Components declared under `.vitepress/theme/components/` (or imported in `.vitepress/theme/index.ts`) can be used directly in Markdown:

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
	<button type="button" @click="count++">Count: {{ count }}</button>
</template>
```

### Authentication with Clerk

The Clerk Vue plugin is registered in `.vitepress/theme/index.ts`. Use the Clerk components in any page or layout:

```vue
<script setup>
import { SignIn, UserButton } from "@clerk/vue";
</script>

<template>
	<SignIn />
	<UserButton />
</template>
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `docs/` | Documentation pages (Markdown) |
| `docs/index.md` | Landing page |
| `blog/` | Blog posts (Markdown with date frontmatter) |
| `.vitepress/config.mts` | VitePress configuration: nav, sidebar, theme |
| `.vitepress/theme/` | Custom theme: components, layouts, styles |
| `.vitepress/theme/components/` | Reusable Vue components |
| `.vitepress/theme/composables/` | Composable helpers |
| `.vitepress/theme/data/` | Static data used by the theme |
| `.vitepress/theme/markdown-plugins/` | Markdown-it plugins |
| `.vitepress/theme/sidebar/` | Sidebar configuration helpers |
| `public/` | Static assets copied to the build output |
| `public/courses/` | Cover art for the courses landing page |
| `public/images/` | Generic images |
| `public/logo/` | Logo assets |
| `test/` | Bun test suite |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `prepare` | `bunx lefthook install` | Install Git hooks |
| `dev` | `bun run src/index.ts` | Start the dev server |
| `build` | `bun build` | Build the static site |
| `preview` | `vitepress preview docs` | Preview the production build |
| `watch` | `vitepress dev docs --watch` | Watch the docs directory |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `typecheck` | `tsgo --noEmit` | Type-check the project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `check` | `oxlint --fix && tsc --noEmit && vue-tsc --noEmit && knip` | Combined lint, typecheck, and dependency audit |
| `knip` | `bunx knip` | Audit unused dependencies |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies |
| `vite.config.ts` | Vite plugins (VitePress, UnoCSS, image optimiser) |
| `uno.config.ts` | UnoCSS configuration |
| `tsconfig.json` | Strict TypeScript settings |
| `.vitepress/config.mts` | VitePress site config (nav, sidebar, search) |
| `.env.example` | Environment variable starter |
| `biome.json` | Lint and format rules |
| `dprint.json` | dprint formatting rules |

### Environment Variables

Copy `.env.example` to `.env` and fill in the values you need:

| Variable | Purpose |
|----------|---------|
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key for the front end |
| `CLERK_SECRET_KEY` | Clerk secret key for server-side flows |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key for payments |
| `STRIPE_SECRET_KEY` | Stripe secret key for server-side flows |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key for client-side queries |

---

## Deployment

The build output is a static site, so any static host works:

| Platform | Command |
|----------|---------|
| Vercel | `bunx vercel --prod` |
| Cloudflare Pages | `bunx wrangler pages deploy .vitepress/dist` |
| Netlify | Drop `.vitepress/dist` into Netlify, or `bunx netlify deploy --prod` |
| GitHub Pages | Push `.vitepress/dist` to a `gh-pages` branch |

```bash
# Vercel
bun run build
bunx vercel --prod

# Cloudflare Pages
bun run build
bunx wrangler pages deploy .vitepress/dist
```

---

## Notes

> [!TIP]
> Use Mermaid diagrams for visual explanations — the `vitepress-plugin-mermaid` plugin is already wired into the theme.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `.vitepress/dist` or `.vitepress/cache/`. They are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Never commit a `.env` file with real Clerk, Stripe, or Supabase keys. Use `.env.example` as the template and keep secrets in your deployment platform's secret store.
