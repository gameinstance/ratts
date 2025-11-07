import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth.service';
import { LoginRequest } from '@protocol/LoginRequest';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css'],
})
export class Login implements OnInit {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);

	form = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required],
	});

	private loginTrigger$ = new Subject<LoginRequest>();
	private login$ = this.loginTrigger$.pipe(
		switchMap(request => this.authService.login(request)),
		takeUntilDestroyed()
	);

	private returnUrl = '/user';
	hasLoginError: boolean = false;

	ngOnInit() {
		const param = this.route.snapshot.queryParamMap.get('ret_url');
		if (param)
			this.returnUrl = param;

		this.login$.subscribe({
			next: () => {
				this.router.navigateByUrl(this.returnUrl);
			},
			error: err => {
				// check err.message for details
				this.hasLoginError = true;
			}
		});
	}

	onSubmit() {
		if (this.form.invalid)
			return;

		this.loginTrigger$.next(this.form.value as LoginRequest);
	}
}
