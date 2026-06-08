# Next.js Template

**A Next.js 15 application with React 19, App Router, Turbopack, and Biome**

A starting point for App Router-based web applications. The default `package.json` declares `nextjs`, ships the standard `dev`/`build`/`start`/`lint`/`typecheck`/`test`/`verify` scripts, and exposes a `react-scan` script for profiling.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-000000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2+-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23000000" width="18" height="18"> | **Next.js 15** | App Router with React Server Components | Fast, SEO-friendly apps with streaming | `bun run dev` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2361dafb" width="18" height="18"> | **React 19** | Latest React with Actions and the new compiler | Modern React development | `import { useState } from "react"` |
| <img src="https://api.iconify.design/lucide:gauge.svg?color=%23f59e0b" width="18" height="18"> | **Turbopack** | Rust-based dev bundler | Near-instant HMR in development | `bun run react-scan` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Strict TypeScript** | `tsc --noEmit` for type checking | Catch errors at compile time | `bun run typecheck` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify components and utilities | `bun run test` |

---

## Key Concepts

> [!NOTE]
> How the App Router shapes the project layout

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:server.svg?color=%236366f1" width="18" height="18"> | **Server Components by Default** | Less JavaScript shipped to the browser |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Compile-time and runtime type validation |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **File-Based Routing** | Routes are folders and files in `app/` |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Nested Layouts** | Layouts compose to share chrome across a tree |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Server Components ship less JS; Turbopack keeps dev loops tight |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Strict TypeScript across server and client boundaries |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Examples and conventions live next to the code they document |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is the App Router? | The router introduced in Next 13 that uses `app/` instead of `pages/`. It supports Server Components and nested layouts |
| How do I add a new page? | Create `app/<route>/page.tsx`. Folders become URL segments automatically |
| Can I deploy statically? | Yes — Next.js produces a static export when configured, or use Vercel for one-click hosting |
| What is the `react-scan` script? | It runs the dev server with Turbopack and points `react-scan` at it for performance profiling |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Prefer Server Components for anything that does not need browser APIs
- Keep client components small and push state to the server where possible
- Add a Vitest test for any non-trivial utility or hook

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent across the codebase
- Use the App Router for new routes; do not mix in `pages/` unless you have a clear reason
- Profile with `bun run react-scan` whenever a render feels slow

</details>

---

## Quick Start

1. **Scaffold the app into a fresh directory**
   ```bash
   templates use next -o ./my-web
   cd my-web
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the dev server**
   ```bash
   bun run dev
   ```

4. **Build a production bundle**
   ```bash
   bun run build
   ```

5. **Start the production server**
   ```bash
   bun run start
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Start the dev server (default port 3000)
bun run dev

# Start with Turbopack for faster HMR
bun run dev --turbopack

# Profile render performance with react-scan
bun run react-scan

# Build the production bundle
bun run build

# Run the production server
bun run start

# Lint the source tree
bun run lint

# Format the source tree
bun run format

# Type-check without emitting
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

### React Components

Write components in `app/components/`. Mark interactive components with the `"use client"` directive at the top of the file.

```tsx
"use client";
import { useState } from "react";

export function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>Count: {count}</p>
			<button type="button" onClick={() => setCount((c) => c + 1)}>
				Increment
			</button>
		</div>
	);
}
```

### Server Components

Server Components are the default. They run on the server, can `await` data, and never reach the browser bundle.

```tsx
// app/page.tsx — Server Component by default
export default async function Page() {
	const data = await fetch("https://api.example.com/data").then((r) => r.json());
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

---

## Reference

### Project Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | App Router pages, layouts, route handlers, and metadata |
| `app/components/custom/` | Project-specific components |
| `app/components/shadcnui/` | shadcn/ui components (when generated) |
| `public/` | Static assets served from the root |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start the dev server with HMR |
| `build` | `next build` | Produce the production bundle |
| `start` | `next start` | Serve the production build |
| `react-scan` | `next dev --turbopack && react-scan` | Profile render performance |
| `lint` | `biome check` | Lint the source tree |
| `format` | `biome check --write` | Auto-format every file |
| `typecheck` | `tsc --noEmit` | Type-check the project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies |
| `next.config.ts` | Next.js configuration (rewrites, headers, images) |
| `tsconfig.json` | Strict TypeScript settings |
| `biome.json` | Lint and format rules |
| `vitest.config.ts` | Vitest configuration |

---

## Notes

> [!TIP]
> Use `bun run dev --turbopack` for near-instant HMR while developing.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `.next/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Mark a component `"use client"` only when it needs browser APIs or interactivity — Server Components ship less JavaScript and are cheaper to render.
