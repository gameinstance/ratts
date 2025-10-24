import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileResponse } from '@protocol/ProfileResponse';
import { Observer } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class UserService {
	private http = inject(HttpClient);

	public profile(observer: Observer<ProfileResponse>) {
		this.http.get<ProfileResponse>('/api/user/profile').subscribe({
			next: (res: ProfileResponse) => {
				observer.next(res);
			},
			error: (err: any) => {
				observer.error(err);
			}
		});
	}
}
