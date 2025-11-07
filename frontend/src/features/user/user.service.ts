import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileResponse } from '@protocol/ProfileResponse';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class UserService {
	private http = inject(HttpClient);

	public profile(): Observable<ProfileResponse> {
		return this.http.get<ProfileResponse>('/api/user/profile');
	}
}
