use argon2::{
	Argon2,
	password_hash::{
		PasswordHasher, PasswordHash,
		PasswordVerifier, SaltString,
		rand_core::OsRng
	},
};

fn argon2_instance() -> Argon2<'static> {
	Argon2::default()
}

pub fn hash_password(password: &str) -> String {
	let salt = SaltString::generate(&mut OsRng);
	let argon2 = argon2_instance();
	argon2.hash_password(password.as_bytes(), &salt)
		.expect("hashing failed")
		.to_string() // PHC string format
}

pub fn verify_password(password: &str, hash_phc: &str) -> bool {
	let parsed = PasswordHash::new(hash_phc).ok();
	match parsed {
		Some(ph) => Argon2::default().verify_password(password.as_bytes(), &ph).is_ok(),
		None => false,
	}
}
