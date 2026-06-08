# Rust Clean Architecture Template

**A Rust library template with Clean Architecture, Vertical Slices, Tokio, and cargo-nextest**

A starting point for Rust crates that follow Clean Architecture principles and organise code as vertical slices. The `Cargo.toml` declares a `library` crate and embeds the task chain (`dev`, `format`, `lint`, `typecheck`, `test`, `build`, `verify`, `ci`) in `[package.metadata.scripts]`, and the matching `moon.yml` wires them up to the monorepo task graph.

[![Rust](https://img.shields.io/badge/Rust-1.83+-dea584?logo=rust)](https://www.rust-lang.org)
[![Tokio](https://img.shields.io/badge/Tokio-1.49+-000000?logo=rust)](https://tokio.rs)
[![Clippy](https://img.shields.io/badge/Clippy-stable-blue?logo=rust)](https://github.com/rust-lang/rust-clippy)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:layers.svg?color=%23dea584" width="18" height="18"> | **Clean Architecture** | Domain stays pure, adapters handle side effects | Code that is easy to test and to evolve | `src/modules/`, `src/adapters/` |
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23f59e0b" width="18" height="18"> | **Vertical Slices** | Feature-based organisation in `src/modules/<feature>/` | New features land in one place, not three | `src/modules/booking/` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Rust's type system and `thiserror`/`anyhow` | Memory safety without a garbage collector | `cargo build` |
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Tokio Runtime** | `tokio` with the `full` feature set | Async I/O, channels, timers, fs, sync | `use tokio::main` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Clippy + rustfmt** | Linting and formatting from the Rust toolchain | Idiomatic, warning-free code | `cargo clippy` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **cargo-nextest + Criterion** | Parallel test runner and benchmarks | Faster tests, measurable performance | `cargo bench` |

---

## Key Concepts

> [!NOTE]
> How Clean Architecture is laid out in this template

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:layout.svg?color=%236366f1" width="18" height="18"> | **Vertical Slices** | One folder per feature, with the layers stacked inside it |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Pure Domain** | Business rules with no I/O, no async, no third-party crates |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%2310b981" width="18" height="18"> | **Dependency Rule** | Dependencies point inward: presentation → application → domain |
| <img src="https://api.iconify.design/lucide:box.svg?color=%23f59e0b" width="18" height="18"> | **Ports and Adapters** | Domain defines traits (ports); adapters implement them for real I/O |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Release profile enables LTO, opt-level 3, and stripped binaries |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Errors modelled as enums with `thiserror`; libraries stay unopinionated |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | `rustfmt` and `clippy` enforce the same style everywhere |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Module-level doc comments plus integration tests in `tests/` |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Vertical Slice Architecture? | Organising code by feature rather than by technical layer. A slice owns its own domain, application, and ports |
| How do I add a new feature? | Create a folder under `src/modules/<feature>/` with `types`, `domain`, `application`, and `ports` submodules |
| Why thiserror and anyhow? | `thiserror` for libraries (typed errors with `From` impls); `anyhow` for binaries (one dynamic error type) |
| How do I run async code? | Annotate `fn main` with `#[tokio::main]` and use the `tokio` re-exports |
| What is cargo-nextest? | A faster, parallel test runner for Rust. Install with `cargo install cargo-nextest` |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `cargo clippy --all-targets` before committing; warnings are bugs in waiting
- Run `cargo test` to confirm unit and integration tests pass
- Keep the domain free of `async` and external crates — the dependency rule is what makes the architecture testable
- Use `Result<T, E>` everywhere; reserve `panic!` for truly unrecoverable cases
- Write a unit test for every public function in the domain

**For Maintainers**

- Follow the dependency rule: `presentation` and `adapters` depend inward, never the other way
- Keep modules small and focused; one feature per slice
- Add a Criterion benchmark for any code path that is performance-sensitive
- Update the doc comment on `lib.rs` whenever the public surface changes

</details>

---

## Quick Start

1. **Scaffold the crate into a fresh directory**
   ```bash
   templates use rust-clean -o ./my-crate
   cd my-crate
   ```

2. **Build the crate**
   ```bash
   cargo build
   ```

3. **Run unit and integration tests**
   ```bash
   cargo test
   ```

4. **Run the benchmarks**
   ```bash
   cargo bench
   ```

5. **Lint with Clippy**
   ```bash
   cargo clippy --all-targets
   ```

---

## Usage

### Cargo

Every script in `[package.metadata.scripts]` is also a direct `cargo` command. Use whichever entry point is more convenient:

```bash
# Run the default binary (or a library entry point)
cargo run

# Build the crate
cargo build
cargo build --release

# Type-check without producing artefacts
cargo check

# Lint with Clippy
cargo clippy
cargo clippy --all-targets

# Format with rustfmt
cargo fmt

# Run tests with the built-in harness
cargo test
cargo test --release
cargo test -- --nocapture

# Run tests with cargo-nextest
cargo nextest run

# Run benchmarks
cargo bench
```

### Moonrepo

When the crate lives inside a Moonrepo workspace, the same tasks run from the root or with a project filter:

```bash
# Run the full verify chain
moon run rust-clean:verify

# Run typecheck and tests
moon run rust-clean:typecheck
moon run rust-clean:test

# Format, lint, and build
moon run rust-clean:format
moon run rust-clean:lint
moon run rust-clean:build

# Watch for changes
moon run rust-clean:watch
```

### Domain Logic

Keep the domain pure. Functions should be total, deterministic, and synchronous:

```rust
// src/modules/booking/domain/operations.rs
pub fn calculate_total(price: u64, quantity: u64) -> u64 {
    price * quantity
}
```

### Use Cases

Use cases orchestrate domain operations. They live in the application layer and may be async:

```rust
// src/modules/booking/application/usecases.rs
pub async fn process_booking(booking: Booking) -> Result<ProcessedBooking, AppError> {
    // load dependencies through ports, call domain, persist, return
    todo!("wire up the booking flow")
}
```

---

## Reference

### Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/lib.rs` | Crate root and public re-exports |
| `src/modules/` | One folder per feature (Vertical Slices) |
| `src/adapters/` | Side effects: config, db, http, external services |
| `src/presentation/` | Entry points: CLI, HTTP, events |
| `src/shared/` | Cross-cutting constants, errors, types, and utilities |
| `tests/` | Integration tests in the `tests/` convention |
| `benches/` | Criterion benchmarks |
| `examples/` | Runnable example programs |
| `Config.toml` | Sample configuration loaded via `figment` |
| `.cargo/config.toml` | Cargo profile and build settings |

### Layer Responsibilities

| Layer | Responsibility | May Import |
|-------|----------------|------------|
| Domain | Pure business rules | `std`, `crate::shared::*` |
| Application | Use cases, orchestration | Domain, ports, `crate::shared::*` |
| Adapters | Real implementations of ports | Application, external crates, async runtimes |
| Presentation | I/O entry points (CLI, HTTP, events) | Application, adapters via DI |
| Shared | Cross-cutting concerns | Anything, used by every layer |

### Tasks

Defined in `[package.metadata.scripts]` and surfaced by `moon.yml`:

| Task | Command | Purpose |
|------|---------|---------|
| `dev` | `cargo run` | Run the default binary |
| `build` | `cargo build` | Build the crate |
| `typecheck` | `cargo check` | Type-check without producing artefacts |
| `lint` | `cargo clippy` | Lint the crate |
| `format` | `cargo fmt` | Format with rustfmt |
| `test` | `cargo nextest run` | Run the test suite (requires cargo-nextest) |
| `scan` | `cargo clippy --all-targets` | Lint every target, including tests and benches |
| `verify` | `cargo clippy && cargo check && cargo nextest run` | Full quality gate |
| `ci` | `verify && cargo build` | Full quality gate plus a build |

### Configuration

| File | Purpose |
|------|---------|
| `Cargo.toml` | Crate manifest, dependencies, metadata scripts |
| `.cargo/config.toml` | Profile and build settings (LTO, opt-level, strip) |
| `Config.toml` | Sample application config consumed by `figment` |
| `moon.yml` | Moonrepo task bindings |
| `clippy.toml` | Clippy lint configuration (when present) |
| `rustfmt.toml` | rustfmt formatting rules (when present) |

### Dependencies

| Crate | Purpose |
|-------|---------|
| `thiserror` | Typed error enums for library code |
| `anyhow` | Dynamic errors for binary entry points |
| `tokio` | Async runtime (with the `full` feature set) |
| `figment` | Layered configuration loading from TOML, env, and code |
| `tracing` + `tracing-subscriber` | Structured, span-aware logging |
| `serde` | Serialization and deserialization with the `derive` feature |
| `criterion` (dev) | Statistical benchmarking |
| `mockall` (dev) | Mock generation for traits in tests |

### Environment Variables

`tracing-subscriber` is initialised with the `env-filter` feature, so any `tracing` directive can be set with the `RUST_LOG` variable:

```bash
# Show info-level events from the crate and warn from everywhere else
RUST_LOG=my_crate=info,warn cargo run

# Trace everything
RUST_LOG=trace cargo run
```

---

## Notes

> [!TIP]
> Install `cargo-watch` (`cargo install cargo-watch`) and run `cargo watch -x test` for continuous test feedback.

> [!IMPORTANT]
> Run `cargo clippy --all-targets` before committing. It lints the library, the binary, the tests, and the benchmarks in one pass.

> [!WARNING]
> Never commit the `target/` directory. It contains build artefacts and is already covered by `.gitignore`.

> [!CAUTION]
> Avoid `unsafe` unless absolutely necessary. If you do use it, add a `// SAFETY:` comment that explains the invariants you rely on.
