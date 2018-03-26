import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../data_models/userprofile.model';
import { AuthService } from '../../modules/auth/services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
	user: User;

	private userSubscription: Subscription;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private authService: AuthService) { }

	ngOnInit() {
		this.userSubscription = this.authService.user$
									.pipe(takeUntil(this.destroyed$))
									.subscribe((user) => this.user = user);
	}

	ngOnDestroy() {
		// prevent memory leak when component is destroyed
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	logout() {
		this.authService.logout();
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	imageUrl() {
		if (this.user &&
			this.user.userProfile.imageUrl &&
			this.user.userProfile.imageUrl !== './img/person_profile_new.png') {
			return this.user.userProfile.imageUrl;
		}

		return './assets/user_profile.png';
	}
}
