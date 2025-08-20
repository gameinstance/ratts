pub mod auth;
pub mod user;

use axum::Router;
use axum::{
	body::Body,
	http::Request,
	middleware::Next,
	response::Response,
	routing::get_service
};
use tower_http::services::{ServeDir, ServeFile};
use crate::{
	error::AppResult,
	state::AppState
};

pub fn routes(app_state: AppState) -> Router<AppState> {
	let service = ServeDir::new("static").fallback(ServeFile::new("static/index.html"));

	Router::new()
		.nest_service(
			"/",
			get_service(service).handle_error(|_| async { axum::http::StatusCode::INTERNAL_SERVER_ERROR }),
		)
		.nest("/api", api_routes(app_state))
		.layer(axum::middleware::from_fn(log_request))
}

pub fn api_routes(app_state: AppState) -> Router<AppState> {
	Router::new()
		.nest("", auth::routes())
		.nest("/user", user::routes(app_state))
}

async fn log_request(request: Request<Body>, next: Next) -> AppResult<Response> {
	let uri = request.uri().clone();
	let method = request.method().clone();

	let start_time = std::time::Instant::now();
	let response = next.run(request).await;
	let duration = start_time.elapsed();

	println!(
		"{:?} -> {}	status: {}	duration: {:?}",
		method, uri,
		response.status(), duration
	);

	Ok(response)
}
