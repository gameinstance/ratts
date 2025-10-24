import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '@core/auth.service';

@Component({
	selector: 'app-user-layout',
	imports: [RouterOutlet, RouterLink],
	templateUrl: './user-layout.html',
	styleUrl: './user-layout.css'
})
export class UserLayout {
	private authService = inject(AuthService);

	onLogout() {
		this.authService.logout();
	}
}
