use sqlx::PgPool;
use crate::{
	error::{AppError, AppResult},
	model::user::{NewUser, User, PrivateUser},
};

pub async fn get_by_id(pool: &PgPool, id: i64) -> AppResult<User> {
	sqlx::query_as::<_, User>("SELECT * FROM authentication.\"user\" WHERE id = $1")
		.bind(id)
		.fetch_optional(pool)
		.await?
		.ok_or(AppError::NotFound)
}

pub async fn get_private_by_email(pool: &PgPool, email: &str) -> AppResult<PrivateUser> {
	sqlx::query_as::<_, PrivateUser>("SELECT * FROM authentication.\"user\" WHERE email = $1")
		.bind(email)
		.fetch_optional(pool)
		.await?
		.ok_or(AppError::NotFound)
}

pub async fn create(pool: &PgPool, new_user: NewUser) -> AppResult<User> {
	let record = sqlx::query_as::<_, User>("INSERT INTO authentication.\"user\" (email, password_hash) VALUES ($1, $2) RETURNING *")
		.bind(new_user.email)
		.bind(new_user.password_hash)
		.fetch_one(pool)
		.await?;

	Ok(record)
}
