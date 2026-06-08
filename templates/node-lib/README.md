# Node Library Template

**A Node-pinned TypeScript library template with Effect, Zod, Biome, and Vitest**

A starting point for publishable TypeScript packages that target Node.js 18+. The `engines` field pins Node, and the shared task chain (format, lint, typecheck, test, build, verify) lines up with the rest of the monorepo.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vitest](https://img.shields.io/badge/Vitest-3+-6e9f18?logo=vitest)](https://vitest.dev)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:server.svg?color=%23339933" width="18" height="18"> | **Node 18+ Engine** | `engines.node` pins the minimum Node version | Predictable behaviour across environments | `bun run dev` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Strict TypeScript** | TSGO type checking with `tsgo --noEmit` | Catch errors before they ship | `bun run typecheck` |
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Effect** | Functional programming with typed error channels | Predictable async flows and resource handling | `import { Effect } from "effect"` |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%23ec4899" width="18" height="18"> | **Zod** | Schema-first runtime validation | Validate external data with the same types you write | `import { z } from "zod"` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%238b5cf6" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit and integration tests with watch mode | Verify behaviour as you change it | `bun run test` |

---

## Key Concepts

> [!NOTE]
> Conventions and tooling shared with the Bun library template

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Pure Functions** | Logic lives in pure functions you can compose and test |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Compile + Runtime Types** | TypeScript for compile-time, Zod for runtime |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%2310b981" width="18" height="18"> | **Layered Source Tree** | `src/services`, `src/types`, `src/utils`, `src/lib`, `src/components` keep concerns separate |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Shared Task Chain** | `format → lint → typecheck → test → build` matches the rest of the monorepo |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | TSGO type checker, Biome linter, Bun for install — every step is fast |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Errors surface at compile time, never at runtime |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Identical scripts and options to the Bun library template |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Public APIs ship with examples in the same tree |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is the difference from the Bun library template? | This one pins Node 18+ in `engines`; the rest of the toolchain is identical |
| Can I run it with Bun? | Yes — every script works under Bun. The Node pin is for downstream consumers |
| Why Effect and Zod? | Effect models async and resource handling with typed errors; Zod validates untrusted data at the boundary |
| What is TSGO? | A Go-based TypeScript compiler focused on speed; it powers the `typecheck` script |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Validate any input that crosses a trust boundary with a Zod schema
- Wrap side effects in an `Effect` so they compose with the rest of your program
- Keep the public surface of `src/index.ts` small and well-typed

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep the codebase consistent
- Add an example in `examples/` for any non-trivial public function
- Bump the Node engine in lockstep with the language features you adopt

</details>

---

## Quick Start

1. **Scaffold the library into a fresh directory**
   ```bash
   templates use node-lib -o ./my-node-lib
   cd my-node-lib
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Run the library in watch mode**
   ```bash
   bun run dev
   ```

4. **Run the tests**
   ```bash
   bun run test
   ```

5. **Build a production bundle**
   ```bash
   bun run build
   ```

---

## Usage

### Library Development

The scripts in `package.json` are the day-to-day entry points:

```bash
# Watch mode: re-run the verify chain on every change
bun run watch

# Run the source file directly via Bun
bun run dev

# Format every file with Biome
bun run format

# Lint the source and test trees
bun run lint

# Type-check without emitting
bun run typecheck

# Run the Vitest suite
bun run test

# Run lint, typecheck, and tests together
bun run verify

# Produce a production bundle
bun run build

# Run the full CI pipeline
bun run ci

# Scan the source tree with ast-grep
bun run scan
```

### Effect Usage

Wrap side effects in an `Effect` so the program stays composable and testable:

```typescript
import { Effect } from "effect";

const program = Effect.sync(() => {
	console.log("Hello from Effect");
	return 42;
});

await Effect.runPromise(program);
```

### Zod Validation

Use a Zod schema wherever data crosses a trust boundary (HTTP, CLI, IPC, files):

```typescript
import { z } from "zod";

const UserSchema = z.object({
	name: z.string().min(1),
	age: z.number().int().min(0),
});

const result = UserSchema.parse({ name: "Ada", age: 36 });
```

---

## Reference

### Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/` | Library source code |
| `src/lib/` | Top-level library entrypoints |
| `src/services/` | Business logic and side-effecting modules |
| `src/types/` | Shared TypeScript types |
| `src/utils/` | Pure utility helpers |
| `src/constant/` | Constants and enumerations |
| `src/components/` | Reusable building blocks |
| `test/` | Vitest unit tests |
| `examples/` | Runnable example scripts |
| `benches/` | Performance benchmarks |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `watch` | `bun --watch verify` | Re-run lint, typecheck, and tests on file change |
| `dev` | `bun run src/index.ts` | Run the entry source file through Bun |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `build` | `bun build` | Produce a production bundle |
| `test` | `vitest run` | Run the Vitest suite once |
| `verify` | `lint && typecheck && test` | Run the full quality gate |
| `typecheck` | `tsgo --noEmit` | Type-check the source tree |
| `scan` | `ast-grep scan` | Scan for code patterns with ast-grep |
| `ci` | `verify && build` | Run the full CI pipeline |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, exports, scripts, dependencies, `engines` |
| `tsconfig.json` | Strict TypeScript settings (paths, lib targets, module resolution) |
| `biome.json` | Lint and format rules |
| `vitest.config.ts` | Vitest configuration |

---

## Notes

> [!TIP]
> Use `bun run watch` while you develop — it re-runs the verify chain on every save and catches regressions early.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `dist/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> If you raise the minimum Node version, update `engines.node` in `package.json` so consumers see the bump in the install output.
