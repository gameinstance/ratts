import { Routes } from '@angular/router';
import { UserLayout } from './user-layout/user-layout';
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
		]
	}
];
