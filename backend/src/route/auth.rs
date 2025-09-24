use axum::{
	Json, Router, debug_handler,
	extract::{Path, State},
	routing::{get, post},
};
use validator::validate_email;
use crate::{
	auth::password::{hash_password, verify_password},
	comms::{email, email_template},
	db::user::{get_private_by_email, create},
	error::{AppError, AppResult},
	model::user::{UserStatus, AuthenticationClaims, RegistrationClaims},
	protocol::auth::{
		EmailRegistrationRequest, PasswordRegistrationRequest, LoginRequest,
		RegistrationResponse, AuthResponse
	},
	state::AppState,
};

pub fn routes() -> Router<AppState> {
	Router::new()
		.route("/submit_email", post(submit_email_handler))
		.route("/verify_email/:token", get(verify_email_handler))
		.route("/register", post(register_handler))
		.route("/login", post(login_handler))
}

#[debug_handler]
async fn submit_email_handler(
	State(state): State<AppState>,
	Json(payload): Json<EmailRegistrationRequest>,
) -> AppResult<Json<RegistrationResponse>> {
	if !validate_email(&payload.email) {
		return Err(AppError::Validation("Invalid email format".to_string()));
	}

	let token = crate::auth::jwe::encode(RegistrationClaims{email: payload.email.clone()}, &state.config.jwe)?;

	let (subject, body) = email_template::registration_verification_email_body(
													&payload.email, &state.config.server_url, &token);
	email::send(&state.config.smtp, state.config.email_from.clone(), payload.email.clone(), subject, body)
		.await
		.map_err(|_| AppError::Internal("Please try again later".to_string()))?;

	println!("submit_email: sent verification email to {}", &payload.email);

	Ok(Json(RegistrationResponse{message: "follow e-mailed instruction".to_string()}))
}

#[debug_handler]
async fn verify_email_handler(
	Path(token): Path<String>,
	State(state): State<AppState>,
) -> AppResult<Json<AuthResponse>> {
	let claims: RegistrationClaims = crate::auth::jwe::decode(&token, &state.config.jwe)?;

	println!("verify_email: email={}", &claims.email);

	Ok(Json(AuthResponse { token, valid: state.config.jwe.token_validity }))
}

#[debug_handler]
async fn register_handler(
	State(state): State<AppState>,
	Json(payload): Json<PasswordRegistrationRequest>,
) -> AppResult<Json<AuthResponse>> {
	let claims: RegistrationClaims = crate::auth::jwe::decode(&payload.token, &state.config.jwe)?;
	if !validate_email(&claims.email) {
		println!("register: invalid email format; email={}", &claims.email);

		return Err(AppError::Validation("Invalid email format".to_string()));
	}

	let new_user = crate::model::user::NewUser {
		email: claims.email.clone(),
		password_hash: hash_password(&payload.password),
	};
	let _user = create(&state.db, new_user)
		.await
		.map_err(|_| AppError::Internal("Please try again later".to_string()))?;

	let (subject, body) = email_template::registration_confirmation_body(
													&claims.email, &state.config.server_url);
	email::send(&state.config.smtp, state.config.email_from.clone(), claims.email.clone(), subject, body)
		.await
		.map_err(|_| AppError::Internal("Please try again later".to_string()))?;

	println!("register: created user {}", &claims.email);

	Ok(Json(AuthResponse { token: "".to_string(), valid: state.config.jwe.token_validity }))
}

#[debug_handler]
async fn login_handler(
	State(state): State<AppState>,
	Json(payload): Json<LoginRequest>,
) -> AppResult<Json<AuthResponse>> {
	let optional_user = get_private_by_email(&state.db, &payload.email).await;

	let password_hash = match optional_user {
		Ok(ref user) => &user.password_hash,
		Err(_) => &state.dummy_hash
	};
	if !verify_password(&payload.password, &password_hash) {
		return Err(AppError::InvalidCredentials);
	}

	if optional_user.is_err() {
		return Err(AppError::InvalidCredentials);
	}

	let user = optional_user.unwrap();
	if user.status != UserStatus::Active {
		return Err(AppError::InvalidCredentials);
	}

	let token = crate::auth::jwe::encode(AuthenticationClaims{uid: user.id}, &state.config.jwe)?;

	println!("login: generated token for {}", &payload.email);

	Ok(Json(AuthResponse { token, valid: state.config.jwe.token_validity}))
}
