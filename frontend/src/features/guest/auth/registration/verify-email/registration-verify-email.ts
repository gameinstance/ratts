import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

	private verifyTrigger$ = new Subject<string>();
	private verify$ = this.verifyTrigger$.pipe(
		switchMap(request => this.authService.verify_token(request)),
		takeUntilDestroyed()
	);
	private registerTrigger$ = new Subject<PasswordRegistrationRequest>();
	private register$ = this.registerTrigger$.pipe(
		switchMap(request => this.authService.register_password(request)),
		takeUntilDestroyed()
	);

	ngOnInit() {
		this.token = this.route.snapshot.paramMap.get('token') || '';
		this.formState = FormState.Idle;

		if (this.token == '') {
			this.formState = FormState.Failed;

			return;
		}

		this.verify$.subscribe({
			next: () => {this.formState = FormState.VerifiedToken;},
			error: () => {this.formState = FormState.Failed;},
			complete: () => {}
		});
		this.register$.subscribe({
			next: () => {this.formState = FormState.SubmittedPassword;},
			error: () => {this.formState = FormState.Failed;},
			complete: () => {}
		});
		this.verifyTrigger$.next(this.token as string);
	}

	onSubmit() {
		if (this.form.valid) {
			this.registerTrigger$.next({
				password: this.form.value.password,
				token: this.token
			} as PasswordRegistrationRequest);
		} else {
			this.form.markAllAsTouched();
		}
	}
}
