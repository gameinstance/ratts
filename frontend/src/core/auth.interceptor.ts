import { Injectable, inject } from '@angular/core';
import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '@core/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private tokenService = inject(TokenService);

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = this.tokenService.get();

		const authReq = token?
				req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) :
				req;

		return next.handle(authReq);
	}
}
