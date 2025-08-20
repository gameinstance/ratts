import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileResponse } from '@protocol/ProfileResponse';
import { UserService } from '@services/user.service';

@Component({
	selector: 'app-user-profile',
	imports: [CommonModule],
	templateUrl: './user-profile.html',
	styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
	profile?: ProfileResponse;
	hasError: boolean = false;

	private userService = inject(UserService);

	ngOnInit() {
		this.userService.profile({
			next: (res) => {this.profile = res;},
			error: () => {this.hasError = true;},
			complete: () => {}
		});
	}
}
