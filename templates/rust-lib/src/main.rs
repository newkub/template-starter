//! Application entry point (Composition Root).
//!
//! This is the main entry point for the application.

use rust_package::app::App;
use rust_package::config::AppConfig;
use rust_package::error::Result;
use rust_package::telemetry;

fn main() -> Result<()> {
    // Initialize telemetry
    telemetry::init_subscriber();

    // Load configuration
    let config = AppConfig::load()?;

    // Create and run application
    let app = App::new(config);
    app.run()?;

    Ok(())
}
