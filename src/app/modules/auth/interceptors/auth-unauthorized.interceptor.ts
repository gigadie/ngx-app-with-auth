import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthUnathorizedInterceptor implements HttpInterceptor {
	constructor(private inj: Injector) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authService = this.inj.get(AuthService);

		return next
			.handle(request)
			.pipe(
				tap(
					(event: HttpEvent<any>) => {
						const expDate = localStorage.getItem('expiry_date') && JSON.parse(localStorage.getItem('expiry_date'));

						if (localStorage.getItem('access_token') && localStorage.getItem('refresh_token') && expDate) {
							const now = (new Date()).getTime();
							const diff = expDate.time_end - now;

							if (diff > 0 && diff / (expDate.time_end - expDate.time_start) < 0.35) {
								// try refresh
								authService.refreshToken();
							}
						}
					},
					(err: any) => {
						if (err instanceof HttpErrorResponse) {
							if (err.status === 401) {
								// de-authorize requests
								// redirect to the login route
								authService.deleteIdentityAndPromptLogin();
							}
						}
					}
				)
			);
	}
}
