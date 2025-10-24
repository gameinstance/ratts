import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@core/auth.interceptor';
import { UserLayout } from './user-layout/user-layout';
import { UserService } from './user.service';
import { UserDashboard } from './dashboard/user-dashboard';
import { UserProfile } from './profile/user-profile';

export const userRoutes: Routes = [
	{
		path: '',
		component: UserLayout,
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: UserDashboard },
			{ path: 'profile', component: UserProfile }
		],
		providers: [
			UserService,
			provideHttpClient(withInterceptorsFromDi()),
			{
				provide: HTTP_INTERCEPTORS,
				useClass: AuthInterceptor,
				multi: true,
			},
		]
	}
];
