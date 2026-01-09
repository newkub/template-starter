//! Application layer.
//!
//! This module orchestrates business flows.

use crate::config::AppConfig;
use crate::error::Result;

/// Application struct.
pub struct App {
    /// Application configuration.
    config: AppConfig,
}

impl App {
    /// Create a new application instance.
    ///
    /// # Arguments
    /// * `config` - Application configuration.
    #[must_use]
    pub fn new(config: AppConfig) -> Self {
        Self { config }
    }

    /// Run the application.
    ///
    /// # Errors
    /// Returns `AppError` if the application fails to run.
    pub fn run(&self) -> Result<()> {
        tracing::info!("Starting application on port {}", self.config.api.port);
        tracing::info!("Database URL: {}", self.config.database.url);
        Ok(())
    }
}
