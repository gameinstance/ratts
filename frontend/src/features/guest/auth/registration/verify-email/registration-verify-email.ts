import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { passwordValidator, passwordMatchValidator } from '@shared/validators';
import { PasswordRegistrationRequest } from '@protocol/PasswordRegistrationRequest';

enum FormState {
	Idle = 'Idle',
	VerifiedToken = 'VerifiedToken',
	SubmittedPassword = 'SubmittedPassword',
	Failed = 'Failed',
}

@Component({
	selector: 'app-registration-verify-email',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './registration-verify-email.html',
	styleUrl: './registration-verify-email.css'
})
export class RegistrationVerifyEmail implements OnInit {
	FormState = FormState;
	readonly passwordMinLength = 8;

	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);
	private route = inject(ActivatedRoute);

	token!: string;
	formState: FormState = FormState.Idle;
	form = this.formBuilder.group({
		password: ['', [Validators.required, Validators.minLength(this.passwordMinLength), passwordValidator()]],
		confirmPassword: ['', [Validators.required]]
	},
	{
		validators: passwordMatchValidator()
	});

	async ngOnInit() {
		this.token = this.route.snapshot.paramMap.get('token') || '';
		if (this.token == '') {
			this.formState = FormState.Failed;

			return;
		}
		this.formState = FormState.Idle;

		try {
			await firstValueFrom(this.authService.verify_token(this.token as string));
			this.formState = FormState.VerifiedToken;
		} catch (err) {
			// check err.message for details
			this.formState = FormState.Failed;
		}
	}

	async onSubmit() {
		if (!this.form.valid) {
			this.form.markAllAsTouched();

			return;
		}

		try {
			await firstValueFrom(this.authService.register_password({
				password: this.form.value.password,
				token: this.token
			} as PasswordRegistrationRequest));
			this.formState = FormState.SubmittedPassword;
		} catch (err) {
			// check err.message for details
			this.formState = FormState.Failed;
		}
	}
}
