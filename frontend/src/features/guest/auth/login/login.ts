import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth.service';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css'],
})
export class Login {
	form: FormGroup;
	hasLoginError: boolean = false;
	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);

	constructor() {
		this.form = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});
	}

	onSubmit() {
		if (this.form.invalid)
			return;

		this.authService.login(this.form.value, {
			next: () => {},
			error: () => {
				this.hasLoginError = true;
			},
			complete: () => {}
		});
	}
}
