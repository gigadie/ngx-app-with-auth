import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../../data_models/userprofile.model';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		const url: string = state.url;

		return this.checkIdentityAndPermissions(url, route.firstChild || route);
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return this.canActivate(route, state);
	}

	private toError(): boolean {
		this.router.navigateByUrl('/error', { skipLocationChange: true });

		return false;
	}

	private toLogin(errMsg: string, url: string): boolean {
		this.authService.redirectUrl = url.indexOf('/login') === -1 ? url : null;

		this.router.navigateByUrl('/login', { skipLocationChange: true });

		return false;
	}

	private checkPermissions(url: string, user: User, activatedRoute: ActivatedRouteSnapshot): boolean {
		if (url.indexOf('/error') !== -1) {
			return true;
		}

		if (!user.hasAnyFeatures()) {
			return this.toError();
		}

		if (activatedRoute.data &&
			activatedRoute.data.features &&
			activatedRoute.data.features.length > 0) {

			const might = activatedRoute.data.features.reduce((result: boolean, feature: string) => {
				return result || user.hasFeature(feature);
			}, false);

			if (!might) {
				return this.toError();
			}
		}

		if (activatedRoute.data &&
			activatedRoute.data.permissions &&
			activatedRoute.data.permissions.length > 0) {

			const can = activatedRoute.data.permissions.reduce((result: boolean, permission: string[]) => {
				return 	result ||
						(permission.length === 2 && user.hasPermission(permission[0], permission[1]));
			}, false);

			if (!can) {
				return this.toError();
			}
		}

		return true;
	}

	private checkIdentityAndPermissions(url: string, activatedRoute: ActivatedRouteSnapshot): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this
				.authService
				.getIdentity()
				.then(user => resolve(this.checkPermissions(url, user, activatedRoute)))
				.catch(err => resolve(this.toLogin('User doesn\'t have an identity: ' + err, url)));
		});
	}
}
