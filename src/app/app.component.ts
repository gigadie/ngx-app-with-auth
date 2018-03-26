import { Component } from '@angular/core';

import { AuthService } from './modules/auth/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent {
	title = 'App with Auth';

	constructor(private authService: AuthService) { }

	isLoggedIn(): boolean {
		return this.authService
				.isLoggedIn();
	}
}
