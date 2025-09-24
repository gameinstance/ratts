use std::net::SocketAddr;

#[derive(Debug, Clone)]
pub struct SmtpConfig {
	pub username: String,
	pub password: String,
	pub address: String,
}

#[derive(Debug, Clone)]
pub struct AppConfig {
	pub jwe: crate::auth::jwe::Config,
	pub database_url: String,
	pub listen_addr: SocketAddr,
	pub server_url: String,
	pub email_from: String,
	pub smtp: Option<SmtpConfig>,
}

pub fn load_config() -> Result<AppConfig, Box<dyn std::error::Error>> {
	let jwe = crate::auth::jwe::Config::new(
		&std::env::var("JWT_SIGNATURE_KEY").expect("JWT_SIGNATURE_KEY must be set"),
		&std::env::var("JWE_ENCRYPTION_KEY").expect("JWE_ENCRYPTION_KEY must be set"),
		std::env::var("TOKEN_VALIDITY").unwrap_or_else(|_| "600".to_string())
											.parse().expect("Failed to parse TOKEN_VALIDITY"),
	);
	let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

	let listen_addr = std::env::var("LISTEN_ADDRESS").unwrap_or_else(|_| "0.0.0.0:3000".to_string());
	let listen_addr: SocketAddr = listen_addr.to_string().parse().expect("Invalid address/port");
	let server_url = std::env::var("SERVER_URL").unwrap_or_else(|_| "http://localhost".to_string());

	let email_from = std::env::var("EMAIL_FROM").unwrap_or_else(|_| "RATTS <ratts@gameinstance.com>".to_string());
	let smtp: Option<SmtpConfig> = if std::env::var("SMTP_USERNAME").unwrap_or_else(|_| "".to_string()) != "" {
		Some(SmtpConfig {
			username: std::env::var("SMTP_USERNAME").unwrap_or_else(|_| "".to_string()),
			password: std::env::var("SMTP_PASSWORD").unwrap_or_else(|_| "".to_string()),
			address: std::env::var("SMTP_ADDRESS").unwrap_or_else(|_| "".to_string()),
		})
	} else {
		None
	};
	println!("Configuration loaded");

	Ok(AppConfig {
		jwe,
		database_url,
		listen_addr,
		server_url,
		email_from,
		smtp
	})
}
