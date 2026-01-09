//! Telemetry and logging setup.
//!
//! This module initializes tracing subscriber for structured logging.

use tracing_subscriber::{EnvFilter, FmtSubscriber};

/// Initialize the tracing subscriber.
///
/// This sets up structured logging with environment variable support.
/// Set `RUST_LOG` environment variable to control log level.
pub fn init_subscriber() {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("info"));

    let subscriber = FmtSubscriber::builder()
        .with_env_filter(filter)
        .finish();

    tracing::subscriber::set_global_default(subscriber)
        .expect("Failed to set tracing subscriber");
}
