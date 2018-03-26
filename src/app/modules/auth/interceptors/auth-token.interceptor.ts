import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BrowserDetectorService } from '../../shared/services/browser-detector.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
	constructor(private inj: Injector) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let headers = request.headers;

		const browserDetector = this.inj.get(BrowserDetectorService);
		const ieVersion = browserDetector.detectIE();
		if (ieVersion !== -1) {
			headers = headers
						.set('Cache-control', 'no-cache, no-store')
						.set('Expires', '-1')
						.set('If-Modified-Since', '0')
						.set('Pragma', 'no-cache');
		}

		const token = localStorage.getItem('access_token');

		if (token) {
			headers = headers.set('Authorization', 'Bearer ' + token);
		}

		const authRequest = request.clone({headers: headers});

		return next.handle(authRequest);
	}
}
