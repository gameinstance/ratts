mod auth;
mod config;
mod comms;
mod db;
mod error;
mod middleware;
mod model;
mod protocol;
mod route;
mod state;

use crate::config::load_config;

#[tokio::main]
async fn main() {
	println!("Starting RATTS");

	let config = load_config().expect("Failed to load config");

	let db_pool = match sqlx::postgres::PgPoolOptions::new()
		.max_connections(10)
		.connect(&config.database_url)
		.await
	{
		Ok(db_pool) => {
			println!("Database connection successful");
			db_pool
		}
		Err(err) => {
			println!("Database connection failure: {err:?}");
			std::process::exit(1);
		}
	};

	let app_state = state::AppState {
		config: config.clone(),
		db: db_pool,
		dummy_hash: auth::password::hash_password(&auth::password::generate_random_string(16))
	};
	let router = route::routes(app_state.clone()).with_state(app_state);

	println!("Listening on http://{}", config.listen_addr);
	let listener = tokio::net::TcpListener::bind(config.listen_addr).await.unwrap();
	axum::serve(listener, router).await.unwrap();
}
