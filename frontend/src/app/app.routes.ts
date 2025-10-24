import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthLayout } from '@features/guest/auth/auth-layout/auth-layout';
import { UserLayout } from '@features/user/user-layout/user-layout';
import { Home } from '@features/guest/home/home';
import { About } from '@features/guest/about/about';
import { Login } from '@features/guest/auth/login/login';
import { RegistrationSubmitEmail } from '@features/guest/auth/registration/submit-email/registration-submit-email';
import { RegistrationVerifyEmail } from '@features/guest/auth/registration/verify-email/registration-verify-email';
import { UserDashboard } from '@features/user/dashboard/user-dashboard';
import { UserProfile } from '@features/user/profile/user-profile';
import { canActivateUser } from '@core/user.guard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
	{
		path: '',
		children: [
			{ path: '', component: Home },
			{ path: 'about', component: About },
		]
	},
	{
		path: '',
		component: AuthLayout,
		children: [
			{ path: 'login', component: Login },
			{ path: 'register', component: RegistrationSubmitEmail },
			{ path: 'verify/:token', component: RegistrationVerifyEmail },
		]
	},
	{
		path: 'user',
		component: UserLayout,
		canActivate: [ canActivateUser ],
		runGuardsAndResolvers: 'always',
		children: [
			{ path: '', component: UserDashboard },
			{ path: 'profile', component: UserProfile },
		]
	},
	{
		path: '**',
		component: NotFound
	}
];
