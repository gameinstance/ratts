import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class RegistrationSubmitEmail implements OnInit {
	FormState = FormState;

	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);

	formState: FormState = FormState.Empty;
	form = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]]
	});

	private requestTrigger$ = new Subject<EmailRegistrationRequest>();
	private request$ = this.requestTrigger$.pipe(
		switchMap(request => this.authService.register_email(request)),
		takeUntilDestroyed()
	);

	ngOnInit() {
		this.request$.subscribe({
			next: () => {this.formState = FormState.Submitted;},
			error: () => {this.formState = FormState.Failed;},
			complete: () => {}
		});
	}

	onSubmit() {
		if (this.form.valid) {
			this.requestTrigger$.next(this.form.value as EmailRegistrationRequest);
		} else {
			this.form.markAllAsTouched();
		}
	}
}
