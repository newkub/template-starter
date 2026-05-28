# Rust Clean Architecture

A Rust package template following Clean Architecture principles with Vertical Slice Architecture.

## Structure

```
src/
├── modules/                      # Feature modules (Vertical Slice Architecture)
│   └── [module-name]/            # e.g., booking, payment, user
│       ├── types/                # Domain types (type aliases)
│       ├── domain/               # Pure business logic - no dependencies
│       │   ├── models/           # Data models (readonly types)
│       │   ├── operations/       # Pure functions for business logic
│       │   ├── validators/       # Domain validation functions
│       │   └── events/           # Domain event types only (no handlers)
│       ├── application/          # Orchestration layer (pipeline style)
│       │   ├── usecases/         # Flow orchestration
│       │   └── workflows/        # Complex workflows
│       ├── ports/                # Module-specific interfaces
│       └── index.ts              # Public API exports

├── adapters/                     # External systems integration
│   ├── db/                       # Database layer
│   ├── http/                     # HTTP clients
│   ├── external/                 # External services
│   └── config/                   # Configuration management

├── presentation/                 # Entry points
│   ├── http/                     # HTTP handlers and routes
│   ├── cli/                      # CLI commands
│   └── events/                   # Event handlers

├── shared/                       # Shared kernel
│   ├── types/                    # Common types (Result, Option, Either)
│   ├── utils/                    # Pure utility functions
│   ├── errors/                   # Error types
│   └── constants/                # Static constants (compile-time)

test/                             # Test suite (mirror src structure)
├── fixtures/                    # Shared test data and mocks
├── helpers/                     # Test utilities and setup
└── modules/                     # Mirror src/modules structure
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

## Clean Architecture Principles

- **Domain** = business rules (100% pure)
- **Application** = orchestration + "what happens next" decisions
- **Adapters** = side effects only
- **Presentation** = entry points (I/O only)
- **Shared** = common utilities (pure functions)
