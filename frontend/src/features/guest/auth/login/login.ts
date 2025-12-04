import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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

	private returnUrl = '/user';
	form = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required],
	});
	hasLoginError: boolean = false;

	ngOnInit() {
		const param = this.route.snapshot.queryParamMap.get('ret_url');
		if (param)
			this.returnUrl = param;
	}

	async onSubmit() {
		if (this.form.invalid)
			return;

		try {
			await firstValueFrom(this.authService.login(this.form.value as LoginRequest));
			this.router.navigateByUrl(this.returnUrl);
		} catch (err) {
			// check err.message for details
			this.hasLoginError = true;
		}
	}
}
