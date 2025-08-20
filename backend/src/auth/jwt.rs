use chrono::{Duration, Utc};
use jsonwebtoken::{
	DecodingKey, EncodingKey, Header,
	Validation, decode, encode
};
use serde::{Deserialize, Serialize};
use crate::{
	config::AuthConfig,
	error::AppError,
};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserClaims {
	pub sub: i32,
	pub exp: usize,
}

pub fn create_user_jwt(user_id: i64, config: &AuthConfig) -> Result<String, AppError> {
	let expiration = Utc::now()
		.checked_add_signed(Duration::seconds(config.token_validity as i64))
		.expect("valid timestamp")
		.timestamp() as usize;

	let claims = UserClaims {
		sub: user_id as i32,
		exp: expiration,
	};
	let token = encode(
		&Header::default(),
		&claims,
		&EncodingKey::from_secret(config.jwt_secret.as_bytes()),
	)?;

	Ok(token)
}

pub fn verify_user_jwt(token: &str, config: &AuthConfig) -> Result<UserClaims, AppError> {
	let mut validation = Validation::default();
	validation.validate_exp = true;

	let data = decode::<UserClaims>(token, &DecodingKey::from_secret(config.jwt_secret.as_bytes()), &validation)?;

	Ok(data.claims)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailClaims {
	pub email: String,
	pub exp: usize,
}

pub fn create_email_jwt(email: &str, config: &AuthConfig) -> Result<String, AppError> {
	let expiration = Utc::now()
		.checked_add_signed(Duration::seconds(config.token_validity as i64))
		.expect("valid timestamp")
		.timestamp() as usize;

	let claims = EmailClaims {
		email: email.to_string(),
		exp: expiration,
	};
	let token = encode(
		&Header::default(),
		&claims,
		&EncodingKey::from_secret(config.jwt_secret.as_bytes()),
	)?;

	Ok(token)
}

pub fn verify_email_jwt(token: &str, config: &AuthConfig) -> Result<EmailClaims, AppError> {
	let mut validation = Validation::default();
	validation.validate_exp = true;

	let data = decode::<EmailClaims>(token, &DecodingKey::from_secret(config.jwt_secret.as_bytes()), &validation)?;

	Ok(data.claims)
}
