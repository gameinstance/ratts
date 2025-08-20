pub fn registration_verification_email_body(recipient: &str, server_url: &str, token: &str) -> (String, String) {
	let subject = String::from("RATTS registration - please confirm your email address");
	let body = format!(
		r#"
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>{subject}</title>
</head>
<body>
	<h1>Hi {recipient},</h1>
	<p>Please follow the link below to verify your email address and complete your RATTS account registration. </p>
	<p><a href="{server_url}/verify/{token}">Email verification link</a> </p>
	<p>
		Cheers!<br />
		The RATTS team.
	</p>
</body>
</html>
		"#
	);

	(subject, body)
}


pub fn registration_confirmation_body(recipient: &str, server_url: &str) -> (String, String) {
	let subject = String::from("Welcome to RATTS!");
	let body = format!(
		r#"
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>{subject}</title>
</head>
<body>
	<h1>Hello {recipient}, and welcome to RATTS!</h1>
	<p>As of now you're part of the RATTS community. </p>
	<p>
		You may <a href="{server_url}/login">Login</a> with your email and password
		to access your <a href="{server_url}/user">personal account</a> area.
	</p>
	<p>
		Cheers!<br />
		The RATTS team.
	</p>
</body>
</html>
		"#
	);

	(subject, body)
}
