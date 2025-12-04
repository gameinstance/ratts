import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { EmailRegistrationRequest } from '@protocol/EmailRegistrationRequest';

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

	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);

	formState: FormState = FormState.Empty;
	form = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]]
	});

	async onSubmit() {
		if (!this.form.valid) {
			this.form.markAllAsTouched();

			return;
		}

		try {
			await firstValueFrom(this.authService.register_email(this.form.value as EmailRegistrationRequest));
			this.formState = FormState.Submitted;
		} catch (err) {
			// check err.message for details
			this.formState = FormState.Failed;
		}
	}
}
