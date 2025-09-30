use base64::{Engine as _, engine::general_purpose};
use biscuit::{ClaimsSet, RegisteredClaims, Empty, JWT, JWE, ValidationOptions};
use biscuit::jwk::JWK;
use biscuit::jws::{self, Secret};
use biscuit::jwe;
use biscuit::jwa::{EncryptionOptions, SignatureAlgorithm, KeyManagementAlgorithm, ContentEncryptionAlgorithm};
use chrono::{Duration, Utc};
use rand::RngCore;
use serde::{Serialize, Deserialize};
use crate::{
	error::AppError,
};

#[derive(Debug, Clone)]
pub struct Config {
	pub jwt_signature_key: Vec<u8>,
	pub jwe_encryption_key: Vec<u8>,
	pub token_validity: u32,
}

impl Config {
	pub fn new(sha_key_b64: &str, aes_key_b64: &str, token_validity: u32) -> Config {
		let jwt_signature_key = general_purpose::STANDARD_NO_PAD.decode(sha_key_b64)
				.expect("Failed to decode SHA key from Base64.");
		if jwt_signature_key.len() < 32 {
			panic!("Invalid jwt_signature_key: SHA key must be at least 32 bytes when decoded.");
		}

		let jwe_encryption_key = general_purpose::STANDARD_NO_PAD.decode(aes_key_b64)
				.expect("Failed to decode AES key from Base64.");
		if jwe_encryption_key.len() != 32 {
			panic!("Invalid jwe_encryption_key: AES key must be 32 bytes when decoded.");
		}
		Config {
			jwt_signature_key,
			jwe_encryption_key,
			token_validity
		}
	}
}

pub fn encode<
	Claims: Clone + Serialize + for<'de> Deserialize<'de>
>(
	claims: Claims,
	config: &Config
) -> Result<String, AppError> {
	let expiration = Utc::now()
			.checked_add_signed(Duration::seconds(config.token_validity as i64))
			.ok_or(AppError::Internal("invalid expiration timestamp".to_string()))?;
	let not_before = Utc::now()
			.checked_add_signed(Duration::seconds(-60))
			.ok_or(AppError::Internal("invalid not_before timestamp".to_string()))?;

	let claims_set = ClaimsSet::<Claims> {
		registered: RegisteredClaims {
			expiry: Some(expiration.into()),
			not_before: Some(not_before.into()),
			issued_at: Some(Utc::now().into()),
			..Default::default()
		},
		private: claims,
	};

	let jwt = JWT::new_decoded(
		From::from(jws::RegisteredHeader {
			algorithm: SignatureAlgorithm::HS256,
			..Default::default()
		}),
		claims_set.clone(),
	);

	let jws = jwt.into_encoded(&Secret::Bytes(config.jwt_signature_key.clone()))?;

	let key: JWK<Empty> = JWK::new_octet_key(&config.jwe_encryption_key, Default::default());
	let options = EncryptionOptions::AES_GCM { nonce: generate_nonce().to_vec() };

	let jwe = JWE::new_decrypted(
		From::from(jwe::RegisteredHeader {
			cek_algorithm: KeyManagementAlgorithm::A256GCMKW,
			enc_algorithm: ContentEncryptionAlgorithm::A256GCM,
			// media_type: Some("JOSE".to_string()),
			// content_type: Some("JOSE".to_string()),
			..Default::default()
		}),
		jws.clone(),
	);

	let encrypted_jwe = jwe.encrypt(&key, &options)?;

	let token = encrypted_jwe.unwrap_encrypted().to_string();

	Ok( token )
}

pub fn decode<
	Claims: Clone + Serialize + for<'de> Deserialize<'de>
>(
	token: &str,
	config: &Config
) -> Result<Claims, AppError> {
	let encrypted_token: JWE<Claims, Empty, Empty> = JWE::new_encrypted(&token);
	let key: JWK<Empty> = JWK::new_octet_key(&config.jwe_encryption_key, Default::default());

	let decrypted_jwe = encrypted_token.into_decrypted(
		&key,
		KeyManagementAlgorithm::A256GCMKW,
		ContentEncryptionAlgorithm::A256GCM,
	)?;
	let decrypted_jws = decrypted_jwe.payload()?;

	let verified_jwt = decrypted_jws.clone().into_decoded(
		&Secret::Bytes(config.jwt_signature_key.clone()),
		SignatureAlgorithm::HS256
	)?;

	let validation_options = ValidationOptions::default();
	verified_jwt.validate(validation_options)?;

	let jwt_payload = verified_jwt.payload()?;

	Ok( jwt_payload.private.clone() )
}

fn generate_nonce() -> Vec<u8> { // 96 bit / 8 => 12 bytes
	let mut res = vec![0u8; 12];
	rand::thread_rng().fill_bytes(&mut res);

	res
}
