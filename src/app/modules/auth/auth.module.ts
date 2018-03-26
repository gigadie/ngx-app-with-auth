import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { AuthUnathorizedInterceptor } from './interceptors/auth-unauthorized.interceptor';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';

@NgModule({
	imports: [ CommonModule ],
	declarations: [ ],
	exports: [ ],
	providers: [
		AuthService,
		AuthGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthTokenInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthUnathorizedInterceptor,
			multi: true
		}
	]
})
export class AuthModule { }
