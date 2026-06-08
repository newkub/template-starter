# React + Vite + Nitro Template

**A Vite + React 19 application with AnalogJS Nitro for hybrid SSR/SSG and UnoCSS**

A starting point for React apps that need hybrid server-side rendering or static generation. Vite powers the dev server and build, the AnalogJS Nitro plugin supplies the server runtime, and TanStack Router handles navigation. UnoCSS handles styling and Biome handles linting and formatting.

[![React](https://img.shields.io/badge/React-19.2.6-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?logo=vite)](https://vitejs.dev)
[![Nitro](https://img.shields.io/badge/Nitro-1.22.5-00dc82?logo=nitro)](https://nitro.unjs.io)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23646cff" width="18" height="18"> | **Vite** | Fast dev server with HMR | Instant feedback while you develop | `bun run dev` |
| <img src="https://api.iconify.design/lucide:server.svg?color=%2300dc82" width="18" height="18"> | **Nitro** | Universal server runtime via `@analogjs/vite-plugin-nitro` | One codebase, multiple deployment targets | `bun run build` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2361dafb" width="18" height="18"> | **React 19.2** | Latest React with the new compiler | Modern React development | `import { useState } from "react"` |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%238b5cf6" width="18" height="18"> | **UnoCSS** | Atomic CSS engine | Rapid styling without CSS files | `class="text-red-500"` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify components and utilities | `bun run test` |

---

## Key Concepts

> [!NOTE]
> How Vite, Nitro, and the plugins fit together

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Hybrid Rendering** | Mix SSR and SSG per route, deploy anywhere Nitro supports |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript with TSGO type checking |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **Atomic CSS** | Utility-first styling with UnoCSS |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Git Hooks** | Pre-commit automation with Lefthook |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Vite HMR and Million lint keep the dev loop tight |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Errors surface at compile time, never at runtime |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Conventions live next to the code they document |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Nitro? | A universal web server framework that powers Nuxt and now runs standalone via the AnalogJS Vite plugin |
| How do I add API routes? | Add a file under `src/routes/api/` that exports an event handler; Nitro picks it up automatically |
| Can I deploy as a static site? | Yes — Nitro supports `nuxi generate`-style pre-rendering when configured for it |
| How do I share a public tunnel? | `bun run tunnel` boots `untun` to expose the dev server |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use UnoCSS utility classes for styling — no separate CSS files to manage
- Keep components small and focused
- Use React hooks for state management
- Add a Vitest test for any non-trivial helper

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep API routes in `src/routes/api/`
- Use TanStack Router for navigation

</details>

---

## Quick Start

1. **Scaffold the app into a fresh directory**
   ```bash
   templates use vite-react -o ./my-app
   cd my-app
   ```

2. **Install Git hooks and dependencies**
   ```bash
   bun run prepare
   bun install
   ```

3. **Start the dev server** (default port 5173)
   ```bash
   bun run dev
   ```

4. **Build a production bundle**
   ```bash
   bun run build
   ```

5. **Preview the production bundle**
   ```bash
   bun run preview
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Install the Git hooks (one-time)
bun run prepare

# Start the dev server (default port 5173)
bun run dev

# Build a production bundle
bun run build

# Preview the production bundle
bun run preview

# Expose the dev server through a public tunnel
bun run tunnel

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

### React Components

Write components in `src/`. The Vite dev server hot-reloads on every save.

```tsx
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

### API Routes

Nitro reads `src/routes/api/` and serves every file as an endpoint. The handler is built with `defineEventHandler`:

```typescript
// src/routes/api/hello.ts
export default defineEventHandler(() => {
	return { message: "Hello from Nitro!" };
});
```

### Server Middleware

Middleware lives in `src/middleware/` and runs on every request:

```typescript
// src/middleware/info.ts
export default defineEventHandler((event) => {
	event.context.startedAt = Date.now();
});
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `src/` | Client source code |
| `src/main.tsx` | Client entry that mounts the React app |
| `src/main.server.tsx` | Server entry that Nitro uses for SSR |
| `src/App.tsx` | Top-level component |
| `src/pages/` | Page components |
| `src/middleware/` | Server middleware (request-time hooks) |
| `src/routes/api/` | API routes exposed by Nitro |
| `src/assets/` | Imported assets (fonts, images) |
| `public/` | Static assets served from the root |
| `vite.config.ts` | Vite configuration (plugins, aliases) |
| `nitro.config.ts` | Nitro configuration (preset, storage) |
| `uno.config.ts` | UnoCSS configuration (presets, shortcuts, theme) |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `prepare` | `bunx lefthook install` | Install Git hooks |
| `dev` | `vite` | Start the Vite dev server |
| `build` | `vite build` | Build a production bundle |
| `preview` | `vite preview` | Preview the production bundle |
| `tunnel` | `bunx untun` | Expose the dev server through a public tunnel |
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
| `package.json` | Name, scripts, dependencies |
| `vite.config.ts` | Vite plugins, aliases, Nitro integration |
| `nitro.config.ts` | Nitro preset, storage, route rules |
| `uno.config.ts` | UnoCSS configuration |
| `tsconfig.json` | Strict TypeScript settings |
| `tsconfig.node.json` | Node-side TypeScript settings |
| `biome.json` | Lint and format rules |
| `dprint.json` | dprint formatting rules |
| `.oxlintrc.json` | Oxlint rules |
| `.vscode/settings.json` | VS Code workspace settings |

---

## Notes

> [!TIP]
> Use HMR — the Vite dev server updates the browser on every save without losing component state.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `dist/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> When mixing SSR and client-only code, guard browser APIs with `import.meta.client` (Vite) or `typeof window !== "undefined"` so Nitro's server build does not crash at import time.
