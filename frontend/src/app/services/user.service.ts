import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileResponse } from '@protocol/ProfileResponse';
import { AuthService } from '@services/auth.service';
import { Observer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
	private http = inject(HttpClient);
	private authService = inject(AuthService);

	public profile(observer: Observer<ProfileResponse>) {
		const authToken = this.authService.getToken();
		if (!authToken)
			return observer.error('invalid token');

		let headers = new HttpHeaders();
		headers = headers.append('Authorization', 'Bearer ' + authToken);
		headers = headers.append('Content-Type', 'application/json');

		this.http.get<ProfileResponse>('/api/user/profile', {headers}).subscribe({
			next: (res: ProfileResponse) => {
				observer.next(res);
			},
			error: (err: any) => {
				observer.error(err);
			}
		});
	}
}
