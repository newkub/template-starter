# Rust Package Template

A modern Rust package template following best practices.

## Structure

```
lib/
├── .cargo/
│   └── config.toml       # Build configurations
├── benches/              # Benchmarks
├── examples/             # Usage examples
├── src/
│   ├── app.rs            # Application Layer
│   ├── components/       # Pure Layer: Domain logic
│   ├── services/         # Effect Layer: I/O management
│   ├── adapters/         # External library wrappers
│   ├── config/           # Configuration management
│   ├── types/            # Data structures
│   ├── error.rs          # Custom error types
│   ├── utils/            # Helper functions
│   ├── constants/        # Constants
│   ├── telemetry.rs      # Logging/Tracing setup
│   ├── lib.rs            # Library entry point
│   └── main.rs           # Application entry point
├── tests/                # Integration tests
├── Config.toml           # Main configuration file
├── Cargo.toml
└── README.md
```

## Libraries

- **Error Handling**: `thiserror` (Library), `anyhow` (Application)
- **Testing**: `mockall` (Mocking)
- **Async**: `tokio` (Async Runtime)
- **Configuration**: `figment` (Config from multiple sources)
- **Observability**: `tracing`, `tracing-subscriber` (Logging/Tracing)

## Commands

- `cargo build` - Build the package
- `cargo test` - Run tests
- `cargo bench` - Run benchmarks
- `cargo clippy` - Lint code
- `cargo fmt` - Format code

## Configuration

Configuration is loaded from `Config.toml` and can be overridden with environment variables prefixed with `APP_`.

Example:
- `APP_DATABASE__URL=postgres://...`
- `APP_API__PORT=3000`
