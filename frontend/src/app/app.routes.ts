import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('@features/guest/guest.routes').then(m => m.guestRoutes)
	},
	{
		path: 'user',
		loadChildren: () => import('@features/user/user.routes').then(m => m.userRoutes),
		canLoad: [ AuthGuard ],
		canActivate: [ AuthGuard ],
		runGuardsAndResolvers: 'always'
	},
	{
		path: '**',
		component: NotFound
	}
];
