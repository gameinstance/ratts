import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, Observer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from '@core/token.service';
import { LoginRequest } from '@protocol/LoginRequest';
import { EmailRegistrationRequest } from '@protocol/EmailRegistrationRequest';
import { PasswordRegistrationRequest } from '@protocol/PasswordRegistrationRequest';
import { RegistrationResponse } from '@protocol/RegistrationResponse';
import { AuthResponse } from '@protocol/AuthResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);
	private tokenService = inject(TokenService);

	public isLoggedIn(): boolean {
		return !!this.tokenService.get();
	}
	public hasValidToken(): Observable<boolean> {
		// async, one day
		const token = this.tokenService.get();
		const valid = !!token;
		// tokenService already checked expiration
		return of(valid);
	}

	public login(req: LoginRequest): Observable<AuthResponse> {
		return this.http.post<AuthResponse>('/api/login', req).pipe(
			tap(res => {
				this.tokenService.set(res.token, res.valid);
			})
		);
	}

	public logout() {
		this.tokenService.remove();
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
}
