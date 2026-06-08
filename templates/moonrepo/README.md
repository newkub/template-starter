# Moonrepo Microservices Monorepo

**A microservices monorepo with Bun, Moonrepo, Hono, GraphQL Yoga, and shared packages**

A starting point for a small service-oriented system. It comes with three Hono services (an API gateway and two domain services), a shared `types` package, a `database` and a `utils` package, plus Docker Compose and a Railpack config for image builds.

[![Bun](https://img.shields.io/badge/Bun-1.3.13+-fbf0df?logo=bun)](https://bun.sh)
[![Moonrepo](https://img.shields.io/badge/Moonrepo-1.41.7+-f5f5f5?logo=moonrepo)](https://moonrepo.dev)
[![Hono](https://img.shields.io/badge/Hono-4.12+-ff6e00?logo=hono)](https://hono.dev)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23fbf0df" width="18" height="18"> | **Bun Runtime** | High-performance JavaScript runtime | Fast cold starts and low overhead | `bun run dev` |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%23f5f5f5" width="18" height="18"> | **Moonrepo** | Task orchestration and caching | Run tasks across every project with one command | `moon run` |
| <img src="https://api.iconify.design/lucide:server.svg?color=%23ff6e00" width="18" height="18"> | **Hono Services** | Lightweight HTTP framework for the API and each service | Tiny, fast, type-safe handlers | `import { Hono } from "hono"` |
| <img src="https://api.iconify.design/lucide:database.svg?color=%236366f1" width="18" height="18"> | **GraphQL Yoga** | Schema and resolvers in the API gateway | One endpoint, typed queries | `import { createYoga } from "graphql-yoga"` |
| <img src="https://api.iconify.design/lucide:box.svg?color=%232499ec" width="18" height="18"> | **Docker + Railpack** | Compose stack and per-service image build config | Reproducible local and remote deploys | `moon run :build:container` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Oxlint + TSGO** | Fast linting and type checking | Catch issues in seconds, not minutes | `bun run typecheck` |

---

## Key Concepts

> [!NOTE]
> How the workspace is laid out and how tasks flow through it

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Microservices** | Each service has its own `package.json`, its own `moon.yml`, and its own container |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript across services and shared packages |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **Shared Packages** | `@moonrepo/types`, `@moonrepo/database`, `@moonrepo/utils`, `@moonrepo/config` |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Service Isolation** | Every service is independently buildable, testable, and deployable |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Bun runtime plus Moonrepo's input hashing keep cold and warm builds fast |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Strict TS and Zod validation at every service boundary |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across every service and package |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Each project has its own README with concrete commands |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Moonrepo? | A task orchestrator that runs and caches tasks across a polyglot monorepo |
| How do I add a new service? | Drop a directory under `apps/`, give it a `package.json` and a `moon.yml`, and add it to `moon.yml` at the workspace root |
| How do services talk to each other? | Each service reads the upstream URL from the `*.env` file and uses Hono's `fetch`-style client to call it |
| How do I build container images? | Each service ships a `railpack.json`; run `moon run :build:container` to build them all |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use the shared `@moonrepo/types` package for any type that crosses a service boundary
- Use the shared `@moonrepo/database` package for connections and migrations
- Use `workspace:*` for internal dependencies, never a published version

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent across services
- Keep each service small and focused on one bounded context
- Define service dependencies in `moon.yml` so Moonrepo can order tasks

</details>

---

## Quick Start

1. **Scaffold the monorepo into a fresh directory**
   ```bash
   templates use moonrepo -o ./my-monorepo
   cd my-monorepo
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Install the Git hooks**
   ```bash
   bun run prepare
   ```

4. **Start every service in dev mode**
   ```bash
   bun run dev
   ```

5. **Build container images for every service**
   ```bash
   moon run :build:container
   ```

---

## Usage

### Moonrepo Tasks

Moonrepo runs the shared task chain across every workspace in parallel where it can:

```bash
# Run the same task in every project
moon run :build

# Run a task in one project
moon run api-gateway:dev

# Run every task affected by the current branch
moon run :test --affected

# Validate the workspace configuration
moon check

# Run the CI pipeline
moon ci
```

### Docker

A `docker-compose.yml` orchestrates the three services and the shared infrastructure:

```bash
# Build every service image
moon run :build:container

# Build one service image
moon run api-gateway:build:container

# Start the full stack
docker compose up -d

# Follow logs from every service
docker compose logs -f

# Stop the stack
docker compose down
```

### API Gateway

The API gateway exposes a health endpoint and forwards requests to the user and order services:

```bash
# Health check
curl http://localhost:3000/health

# Forward to the user service
curl http://localhost:3000/api/users

# Forward to the order service
curl http://localhost:3000/api/orders

# Run a GraphQL query against the gateway
curl -X POST http://localhost:3000/graphql \
	-H "Content-Type: application/json" \
	-d '{"query": "{ users { id email } }"}'
```

### Environment Variables

Each service reads its own `.env` file. A starter file at the root lists the variables you need:

```env
NODE_ENV=development
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
ORDER_SERVICE_PORT=3002
USER_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
DATABASE_URL=memory://
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=1d
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `apps/api-gateway/` | API gateway: routing, GraphQL Yoga schema, health checks |
| `apps/user-service/` | Hono service that owns the user domain |
| `apps/order-service/` | Hono service that owns the order domain |
| `packages/types/` | Shared TypeScript types and Zod schemas |
| `packages/database/` | Shared database connection helpers |
| `packages/utils/` | Shared utility functions |
| `packages/config/` | Shared configuration helpers |
| `docker-compose.yml` | Local orchestration of every service |
| `moon.yml` | Workspace-level task definitions |
| `.moon/workspace.yml` | Workspace and toolchain configuration |
| `dprint.json` | dprint configuration |
| `.oxlintrc.json` | Oxlint configuration |

### Shared Tasks

| Task | Command | Purpose |
|------|---------|---------|
| `dev` | `bun run src/index.ts` | Run the entry source file through Bun |
| `build` | `bun build` | Produce a production bundle |
| `start` | `bun dist/index.js` | Run the production bundle |
| `lint` | `biome check` | Lint the source tree |
| `format` | `biome check --write` | Auto-format every file |
| `typecheck` | `tsgo --noEmit` | Type-check the project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |
| `clean` | `rimraf dist` | Remove build artefacts |

### Configuration

| File | Purpose | Location |
|------|---------|----------|
| `package.json` | Workspace list and root scripts | `./package.json` |
| `moon.yml` | Workspace and project task overrides | `./moon.yml` and per-project |
| `dprint.json` | dprint formatting rules | Root |
| `.oxlintrc.json` | Oxlint rules | Root |
| `docker-compose.yml` | Local stack | Root |
| `railpack.json` | Per-service image build config | Each service in `apps/` |

### Moonrepo Options

| Option | Description | Example |
|--------|-------------|---------|
| `--affected` | Run tasks only on projects changed since the base branch | `moon run :build --affected` |
| `--verbose` | Print every shell command before it runs | `moon run :test --verbose` |
| `--dry-run` | Show what would run without executing anything | `moon run :build --dry-run` |
| `--force` | Ignore the task cache and re-run everything | `moon run :build --force` |

### Docker Options

| Option | Description | Example |
|--------|-------------|---------|
| `--build` | Build images before starting the stack | `docker compose up --build` |
| `-d` | Run in the background | `docker compose up -d` |

---

## Notes

> [!TIP]
> Use `moon run <task> --affected` for day-to-day work — cache hits make repeat runs almost instant.

> [!IMPORTANT]
> Run `moon check` after editing any `.moon/*.yml`. It validates the workspace config before you commit a broken setup.

> [!WARNING]
> Never commit `node_modules`, `dist/`, or anything inside `.moon/cache/`. They are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Be careful with service-to-service URLs in `.env` — using the wrong host will make a service silently fall back to defaults.
