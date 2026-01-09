//! Error types for the application.
//!
//! This module defines all error types used throughout the application.

use thiserror::Error;

/// Application error type.
#[derive(Error, Debug)]
pub enum AppError {
    /// Configuration error.
    #[error("Configuration error: {0}")]
    Config(#[from] figment::Error),

    /// User not found.
    #[error("User not found (id: {user_id})")]
    UserNotFound { user_id: String },

    /// External service failed.
    #[error("External service failed: {service_name}")]
    ServiceError {
        service_name: String,
        #[source]
        source: anyhow::Error,
    },

    /// IO error.
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

/// Result type alias for application operations.
pub type Result<T> = std::result::Result<T, AppError>;
