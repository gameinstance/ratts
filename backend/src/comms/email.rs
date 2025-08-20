use lettre::{Message, SmtpTransport, Transport};
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use crate::config::SmtpConfig;

pub async fn send(
	config: &Option<SmtpConfig>,
	from_address: String,
	dest_address: String,
	subject: String,
	body: String
) -> Result<(), Box<dyn std::error::Error>> {
	let email = Message::builder()
		.from(from_address.parse()?)
		.to(dest_address.parse()?)
		.subject(subject)
		.header(ContentType::TEXT_HTML)
		.body(body)?;

	let mailer = match config {
		Some(config) => {
			let credentials = Credentials::new(config.username.clone(), config.password.clone());

			SmtpTransport::relay(&config.address)?
				.credentials(credentials)
				.build()
		}
		None => {
			println!("WARNING: Using dangerous SMTP server configuration!");

			SmtpTransport::builder_dangerous("ratts-smtp")
				.port(1025)
				.build()
		}
	};

	match mailer.send(&email) {
		Ok(_) => {},
		Err(e) => eprintln!("Could not send email: {e:?}"),
	}

	Ok(())
}
