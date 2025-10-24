import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { LoginRequest } from '@protocol/LoginRequest';
import { EmailRegistrationRequest } from '@protocol/EmailRegistrationRequest';
import { PasswordRegistrationRequest } from '@protocol/PasswordRegistrationRequest';
import { RegistrationResponse } from '@protocol/RegistrationResponse';
import { AuthResponse } from '@protocol/AuthResponse';
import { Observer } from 'rxjs';

const authTokenName = 'auth-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);

	public isLoggedIn(): boolean {
		return this.getToken()?
				true : false;
	}

	public login(req: LoginRequest, observer: Observer<AuthResponse>) {
		this.http.post<AuthResponse>('/api/login', req).subscribe({
			next: (res: AuthResponse) => {
				localStorage.setItem(authTokenName, JSON.stringify({
					token: res.token,
					expires: Date.now() + res.valid * 1000
				}));

				this.router.navigate(['/user']);
			},
			error: (err: any) => {
				observer.error(err);
			}
		});
	}

	public logout() {
		localStorage.removeItem(authTokenName);

		this.router.navigate(['/']);
	}

	public register_email(req: EmailRegistrationRequest, observer: Observer<RegistrationResponse>) {
		this.http.post<RegistrationResponse>('/api/submit_email', req).subscribe({
			next: (res: RegistrationResponse) => {
				observer.next(res);
			},
			error: (err: any) => {
				observer.error(err);
			}
		});
	}

	public verify_token(token: string, observer: Observer<AuthResponse>) {
		this.http.get<AuthResponse>('/api/verify_email/' + token).subscribe({
			next: (res: AuthResponse) => {
				observer.next(res);
			},
			error: (err: any) => {
				observer.error(err);
			}
		});
	}

	public register_password(req: PasswordRegistrationRequest, observer: Observer<AuthResponse>) {
		this.http.post<AuthResponse>('/api/register', req).subscribe({
			next: (res: AuthResponse) => {
				observer.next(res);
			},
			error: (err: any) => {
				observer.error(err);
			}
		});
	}

	public getToken(): string | null {
		const dataJson = localStorage.getItem(authTokenName);
		if (!dataJson)
			return null;

		try {
			const authData = JSON.parse(dataJson);
			if (!authData.token
					|| !authData.expires
					|| (Date.now() > authData.expires))
				return null;

			return authData.token;
		} catch (error) {
			return null;
		}
	}
}
