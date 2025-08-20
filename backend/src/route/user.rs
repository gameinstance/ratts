use axum::{
	Extension, Json, Router, debug_handler,
	extract::{State},
	middleware,
	routing::get,
};
use crate::{
	db::user::get_by_id,
	error::{AppError, AppResult},
	middleware::auth::require_auth,
	model::user::{UserSession},
	protocol::user::{ProfileResponse},
	state::AppState,
};

pub fn routes(app_state: AppState) -> Router<AppState> {
	Router::new()
		.route("/profile", get(profile_handler))
		.layer(middleware::from_fn_with_state(app_state, require_auth))
}

#[debug_handler]
async fn profile_handler(
	Extension(session): Extension<UserSession>,
	State(state): State<AppState>,
) -> AppResult<Json<ProfileResponse>> {
	let user = get_by_id(&state.db, session.user_id)
		.await
		.map_err(|_| AppError::Unauthorized)?;

	Ok(Json(user.into()))
}
