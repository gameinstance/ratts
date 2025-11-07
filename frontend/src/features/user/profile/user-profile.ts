import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfileResponse } from '@protocol/ProfileResponse';
import { UserService } from '@features/user/user.service';

@Component({
	selector: 'app-user-profile',
	imports: [CommonModule],
	templateUrl: './user-profile.html',
	styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
	private userService = inject(UserService);

	readonly profile$ = this.userService.profile().pipe(takeUntilDestroyed());

	profile?: ProfileResponse;
	hasError: boolean = false;

	ngOnInit() {
		this.profile$.subscribe({
			next: (res) => {this.profile = res;},
			error: () => {this.hasError = true;},
			complete: () => {}
		});
	}
}
