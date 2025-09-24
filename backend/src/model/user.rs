use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Debug, PartialEq, sqlx::Type, Serialize)]
#[sqlx(type_name = "user_status", rename_all = "lowercase")] // PostgreSQL enum
pub enum UserStatus {
	Active,
	Suspended,
	Deleted,
}

#[derive(Debug, FromRow, Serialize)]
pub struct PrivateUser {
	pub id: i64,
	pub email: String,
	pub password_hash: String,
	pub status: UserStatus,
	pub create_ts: DateTime<Utc>,
	pub update_ts: Option<DateTime<Utc>>
}

#[derive(Debug, FromRow, Serialize)]
pub struct User {
	pub id: i64,
	pub email: String,
	pub status: UserStatus,
	pub create_ts: DateTime<Utc>,
	pub update_ts: Option<DateTime<Utc>>
}

#[derive(Debug, FromRow, Serialize, Clone)]
pub struct UserSession {
	pub user_id: i64,
}

#[derive(Debug, FromRow, Serialize)]
pub struct NewUser {
	pub email: String,
	pub password_hash: String,
}

#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct AuthenticationClaims {
	pub uid: i64,
}

#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct RegistrationClaims {
	pub email: String,
}
