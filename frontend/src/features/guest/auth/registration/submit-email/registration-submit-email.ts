import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth.service';


enum FormState {
	Empty = 'Empty',
	Submitted = 'Submitted',
	Failed = 'Failed',
}

@Component({
	selector: 'app-registration-submit-email',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './registration-submit-email.html',
	styleUrl: './registration-submit-email.css'
})
export class RegistrationSubmitEmail {
	FormState = FormState;

	form: FormGroup;
	formState: FormState = FormState.Empty;

	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);

	constructor() {
		this.form = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]]
		});
	}

	onSubmit() {
		if (this.form.valid) {
			this.authService.register_email(this.form.value, {
				next: () => {this.formState = FormState.Submitted;},
				error: () => {this.formState = FormState.Failed;},
				complete: () => {}
			});
		} else {
			this.form.markAllAsTouched();
		}
	}
}
