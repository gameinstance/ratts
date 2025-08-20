use sqlx::PgPool;
use crate::config::AppConfig;

#[derive(Clone)]
pub struct AppState {
	pub config: AppConfig,
	pub db: PgPool,
	pub dummy_hash: String,
}
