use serde::{Deserialize, Serialize};
use ts_rs::TS;
use crate::model::user::{User};

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ProfileRequest {
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ProfileResponse {
	pub email: String,
}

impl From<User> for ProfileResponse {
	fn from(source: User) -> Self {
		ProfileResponse {
			email: source.email,
		}
	}
}
