//! Rust Layered Architecture Template
//!
//! A template for creating Rust packages following Clean Architecture principles.

pub mod adapters;
pub mod modules;
pub mod presentation;
pub mod shared;

// Re-exports for convenience
pub use shared::errors::{AppError, Result};
