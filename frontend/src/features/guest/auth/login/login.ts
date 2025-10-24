import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth.service';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css'],
})
export class Login implements OnInit {
	form: FormGroup;
	hasLoginError: boolean = false;
	private returnUrl = '/user';
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);

	constructor() {
		this.form = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});
	}

	ngOnInit() {
		const param = this.route.snapshot.queryParamMap.get('ret_url');
		if (param)
			this.returnUrl = param;
	}

	onSubmit() {
		if (this.form.invalid)
			return;

		this.authService.login(this.form.value).subscribe({
			next: () => {
				this.router.navigateByUrl(this.returnUrl);
			},
			error: err => {
				// check err.message for details
				this.hasLoginError = true;
			}
		});
	}
}
