import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth.service';
import { passwordValidator, passwordMatchValidator } from '@shared/validators';


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

	form: FormGroup;
	formState: FormState = FormState.Idle;
	token!: string;


	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);
	private route = inject(ActivatedRoute);

	constructor() {
		this.form = this.formBuilder.group({
			password: ['', [Validators.required, Validators.minLength(this.passwordMinLength), passwordValidator()]],
			confirmPassword: ['', [Validators.required]]
		}, {
			validators: passwordMatchValidator()
		});
	}

	ngOnInit() {
		this.token = this.route.snapshot.paramMap.get('token') || '';
		this.formState = FormState.Idle;

		if (this.token == '') {
			this.formState = FormState.Failed;

			return;
		}

		this.authService.verify_token(this.token, {
				next: () => {this.formState = FormState.VerifiedToken;},
				error: () => {this.formState = FormState.Failed;},
				complete: () => {}
		});
	}

	onSubmit() {
		if (this.form.valid) {
			this.authService.register_password({
					password: this.form.value.password,
					token: this.token
			},
			{
				next: () => {this.formState = FormState.SubmittedPassword;},
				error: () => {this.formState = FormState.Failed;},
				complete: () => {}
			});
		} else {
			this.form.markAllAsTouched();
		}
	}
}
