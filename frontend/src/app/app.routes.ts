import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthLayout } from '@layouts/auth-layout/auth-layout';
import { UserLayout } from '@layouts/user-layout/user-layout';
import { Home } from '@pages/home/home';
import { About } from '@pages/about/about';
import { Login } from '@pages/auth/login/login';
import { RegistrationSubmitEmail } from '@pages/auth/registration/submit-email/registration-submit-email';
import { RegistrationVerifyEmail } from '@pages/auth/registration/verify-email/registration-verify-email';
import { UserDashboard } from '@pages/user/dashboard/user-dashboard';
import { UserProfile } from '@pages/user/profile/user-profile';
import { NotFound } from '@pages/not-found/not-found';
import { canActivateUser } from '@guards/user.guard';

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
