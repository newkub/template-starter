//! Integration tests for the application.

use rust_package::app::App;
use rust_package::config::{ApiConfig, AppConfig, DatabaseConfig};

#[test]
fn test_app_creation() {
    let config = AppConfig {
        database: DatabaseConfig {
            url: "test://localhost".to_string(),
        },
        api: ApiConfig { port: 3000 },
    };

    let app = App::new(config);
    assert!(app.run().is_ok());
}
