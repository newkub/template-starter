//! Rust Package Template
//!
//! A template for creating Rust packages following best practices.

pub mod app;
pub mod config;
pub mod constants;
pub mod error;
pub mod telemetry;
pub mod types;
pub mod utils;

// Re-exports for convenience
pub use error::{AppError, Result};
