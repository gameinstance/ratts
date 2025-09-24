use axum::extract::State;
use axum::{body::Body, http::Request, middleware::Next, response::Response};
use crate::{
	error::{AppError, AppResult},
	model::user::UserSession,
	state::AppState,
};

pub async fn require_auth(
	State(state): State<AppState>,
	mut request: Request<Body>,
	next: Next,
) -> AppResult<Response> {
	let auth_header = request
		.headers()
		.get("Authorization")
		.ok_or(AppError::Unauthorized)?
		.to_str()
		.map_err(|_| AppError::Unauthorized)?;

	if !auth_header.starts_with("Bearer ") {
		return Err(AppError::Unauthorized);
	}

	//  Authorization header w/ "Bearer " prefix
	let token = &auth_header[7..];
	let claims: crate::model::user::AuthenticationClaims = crate::auth::jwe::decode(token, &state.config.jwe)?;

	let session = UserSession {
		user_id: claims.uid as i64,
	};

	request.extensions_mut().insert(session);

	let response = next.run(request).await;

	Ok(response)
}
