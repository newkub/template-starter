//! Configuration management.
//!
//! This module handles loading configuration from multiple sources.

use figment::{Figment, providers::{Format, Toml, Env}};
use serde::Deserialize;

/// Database configuration.
#[derive(Deserialize, Debug)]
pub struct DatabaseConfig {
    /// Database connection URL.
    pub url: String,
}

/// API configuration.
#[derive(Deserialize, Debug)]
pub struct ApiConfig {
    /// API port.
    pub port: u16,
}

/// Application configuration.
#[derive(Deserialize, Debug)]
pub struct AppConfig {
    /// Database configuration.
    pub database: DatabaseConfig,
    /// API configuration.
    pub api: ApiConfig,
}

impl AppConfig {
    /// Load configuration from file and environment variables.
    ///
    /// # Errors
    /// Returns `figment::Error` if configuration cannot be loaded.
    pub fn load() -> Result<Self, figment::Error> {
        Figment::new()
            .join(Toml::file("Config.toml"))
            .join(Env::prefixed("APP_").split("__"))
            .extract()
    }
}
