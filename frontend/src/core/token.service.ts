import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
	readonly authTokenName = 'auth-token';

	public get(): string | null {
		const dataJson = localStorage.getItem(this.authTokenName);
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

	public set(token: string, validity_seconds: number) {
		localStorage.setItem(this.authTokenName, JSON.stringify({
			token: token,
			expires: Date.now() + validity_seconds * 1000
		}));
	}

	public remove() {
		localStorage.removeItem(this.authTokenName);
	}
}
