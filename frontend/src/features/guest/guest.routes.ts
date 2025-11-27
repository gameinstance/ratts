import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { RegistrationSubmitEmail } from './auth/registration/submit-email/registration-submit-email';
import { RegistrationVerifyEmail } from './auth/registration/verify-email/registration-verify-email';

export const guestRoutes: Routes = [
	{
		path: '',
		children: [
			{ path: '', component: Home, pathMatch: 'full' },
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
	}
];
