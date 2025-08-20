use axum::{
	Json,
	http::StatusCode,
	response::{IntoResponse, Response},
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
	#[error("Database error")]
	DbError(#[from] sqlx::Error),

	#[error("Invalid credentials")]
	InvalidCredentials,

	#[error("Unauthorized")]
	Unauthorized,

	#[error("JWT error")]
	JwtError(#[from] jsonwebtoken::errors::Error),

	#[error("Validation error: {0}")]
	Validation(String),

	#[error("Not found")]
	NotFound,

	#[error("Internal server error")]
	Internal(String),
}

impl IntoResponse for AppError {
	fn into_response(self) -> Response {
		let (status, message) = match &self {
			AppError::DbError(msg) => {
				println!("Database error: {msg}");

				self.generic_error_response()
			},
			AppError::InvalidCredentials => self.generic_error_response(),
			AppError::Unauthorized => self.generic_error_response(),
			AppError::JwtError(_) => self.generic_error_response(),
			AppError::Validation(_) => self.generic_error_response(),
			AppError::NotFound => self.generic_error_response(),
			AppError::Internal(msg) => {
				println!("Internal error: {msg}");

				self.generic_error_response()
			},
		};

		let body = Json(json!({
			"error": message,
		}));

		(status, body).into_response()
	}
}

impl AppError {
	fn generic_error_response(&self) -> (StatusCode, String) {
		(StatusCode::INTERNAL_SERVER_ERROR, "Internal error".to_string())
	}
}

pub type AppResult<T> = Result<T, AppError>;
