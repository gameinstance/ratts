import { Routes } from '@angular/router';
import { canActivateUser } from '@core/user.guard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('@features/guest/guest.routes').then(m => m.guestRoutes)
	},
	{
		path: 'user',
		loadChildren: () => import('@features/user/user.routes').then(m => m.userRoutes),
		canLoad: [ canActivateUser ],
		canActivate: [ canActivateUser ],
		runGuardsAndResolvers: 'always'
	},
	{
		path: '**',
		component: NotFound
	}
];
