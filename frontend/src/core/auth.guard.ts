import { Injectable, inject } from '@angular/core';
import {
	CanLoad,
	CanActivate,
	Router,
	Route,
	UrlSegment,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate {
	private readonly loginUrl = '/login';
	private authService = inject(AuthService);
	private router = inject(Router);

	canLoad(
		_route: Route,
		segments: UrlSegment[]
	): Observable<boolean | UrlTree> {
		const attempted = '/' + segments.map(s => s.path).join('/');
		return this.checkAccess(attempted);
	}

	canActivate(
		_next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> {
		return this.checkAccess(state.url);
	}

	private checkAccess(
		attemptedUrl: string
	): Observable<boolean | UrlTree> {
		return this.authService.hasValidToken().pipe(
			map(valid => valid || this.router.createUrlTree([this.loginUrl], {
				queryParams: { ret_url: attemptedUrl }
			}))
		);
	}
}
