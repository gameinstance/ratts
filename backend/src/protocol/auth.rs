use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
	pub email: String,
	pub password: String,
}

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Deserialize)]
pub struct EmailRegistrationRequest {
	pub email: String,
}

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Deserialize)]
pub struct PasswordRegistrationRequest {
	pub token: String,
	pub password: String,
}

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Serialize)]
pub struct AuthResponse {
	pub token: String,
	pub valid: u32,
}

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Serialize)]
pub struct RegistrationResponse {
	pub message: String,
}
