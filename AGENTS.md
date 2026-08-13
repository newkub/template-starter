# AGENTS.md — templates
> Agent guidance for `apps/template-starter` in the `@wrikka/bun-packages` monorepo.

## Overview

- **Package name:** `templates`
- **Version:** `0.0.0`
- **Workspace path:** `apps/template-starter`
- **Type:** `ESM`
- **Entry point:** `src/index.ts`

## Technology

| Tech | Value |
|---|---|
| Package Manager | Bun |
| Runtime | Bun / Node |
| Type | ESM |

## Commands

| Script | Command |
|---|---|
| `prepare` | `bunx lefthook install` |
| `scan` | `ast-grep scan` |
| `check:modules` | `bunx node-modules-inspector` |
| `moon` | `moon` |
| `moon:check` | `moon check` |
| `moon:ci` | `moon ci` |

## Dependencies

| Package | Version | Type |
|---|---|---|
| `@moonrepo/cli` | `^2.3.2` | Dev |

## Notes for AI Agents

- Use **Bun** for running scripts (`bun run <script>`).
- This monorepo uses Turborepo (`turbo run <task>`) and Moonrepo conventions where configured.
- TypeScript native compiler (`tsgo`) is used when available.
- Do not introduce `pnpm-lock.yaml`; this project uses Bun.
- Git submodules in this repo: `apps/template-starter`, `apps/update-dependencies`, `packages/create-cli`. Do not modify submodule contents without committing inside the submodule and updating the parent pointer.
- Before destructive operations (delete, overwrite, `rm -rf`, submodule extraction), ask the user for explicit confirmation.
- Keep English wording and avoid ANSI escape codes in documentation.

## Related Files

- `package.json`
- `README.md`
