# Rust Layered Architecture

A Rust package template following Layered Architecture principles for medium-scale systems.

## Structure

```
src/
├── adapters/                     # External systems integration
│   ├── db/                       # Database layer
│   ├── http/                     # HTTP clients
│   ├── external/                 # External services
│   └── config/                   # Configuration management

├── presentation/                 # Entry points
│   ├── http/                     # HTTP handlers and routes
│   ├── cli/                      # CLI commands
│   └── events/                   # Event handlers

├── modules/                      # Feature modules
│   └── [module-name]/            # e.g., booking, payment, user
│       ├── types/                # Domain types
│       ├── domain/               # Pure business logic
│       ├── application/          # Orchestration layer
│       └── ports/                # Module-specific interfaces

├── shared/                       # Shared kernel
│   ├── types/                    # Common types
│   ├── utils/                    # Pure utility functions
│   ├── errors/                   # Error types
│   └── constants/                # Static constants

test/                             # Test suite
├── fixtures/                    # Shared test data and mocks
└── helpers/                     # Test utilities
```

## Libraries

- **Error Handling**: `thiserror` (Library), `anyhow` (Application)
- **Testing**: `mockall` (Mocking), `criterion` (Benchmarks)
- **Async**: `tokio` (Async Runtime)
- **Configuration**: `figment` (Config from multiple sources)
- **Observability**: `tracing`, `tracing-subscriber` (Logging/Tracing)

## Commands

- `cargo build` - Build the package
- `cargo test` - Run tests
- `cargo bench` - Run benchmarks
- `cargo clippy` - Lint code
- `cargo fmt` - Format code

## Layered Architecture Principles

- **Adapters** = side effects only (db, http, external)
- **Presentation** = entry points (I/O only)
- **Modules** = feature-specific logic
- **Shared** = common utilities (pure functions)
