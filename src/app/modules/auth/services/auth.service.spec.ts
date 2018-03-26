/* tslint:disable:max-line-length */

import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './auth.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { api } from '../../../config/api.config';
import { environment } from '../../../../environments/environment';

import { getIdentityUtil } from '../../../../testing/get-identity.utility';

// ADDED CLASS
class MockRouter {
	navigateByUrl(url: string) { return url; }
}

describe('AuthServiceTest', () => {
	let authService: AuthService = null;
	let httpMock: HttpTestingController = null;

	beforeEach(async(() => {
		// Spying localstorage
		let store = {};

		spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
			return store[key] || null;
		});
		spyOn(localStorage, 'removeItem').and.callFake((key: string): void =>  {
			delete store[key];
		});
		spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string =>  {
			return store[key] = <string>value;
		});
		spyOn(localStorage, 'clear').and.callFake(() =>  {
			store = {};
		});

		TestBed.configureTestingModule({
			imports: [ RouterTestingModule, HttpClientTestingModule ],
			providers: [ AuthService,
				{ provide: Router, useClass: MockRouter }
			]
		});
	}));

	beforeEach(inject([AuthService], (service: AuthService) => {
		authService = service;
		httpMock = TestBed.get(HttpTestingController);
	}));

	it('Should remove tokens', () => {
		// Arrange
		localStorage.setItem('access_token', 'access_token_value');
		localStorage.setItem('refresh_token', 'refresh_token_value');
		localStorage.setItem('expiry_date', 'expiry_date_value');

		// Act
		authService.removeToken();

		// Assert
		expect(localStorage.getItem('access_token')).toBeNull();
		expect(localStorage.getItem('refresh_token')).toBeNull();
		expect(localStorage.getItem('expiry_date')).toBeNull();
	});

	it('IsAuthenticated should check access_token value', () => {
		localStorage.setItem('access_token', 'access_token_value');
		expect(authService.isAuthenticated()).toBe(true);

		localStorage.removeItem('access_token');
		expect(authService.isAuthenticated()).toBe(false);
	});

	it('Should save tokens to localstorage', () => {
		// Arrange
		spyOn(authService, 'calculateTokenExpiryDate').and.returnValue('{"time_start":1509722766940, "time_end":1509726365940}');

		const actualToken = 'BwD9xpmRzDDrLCKeVr1ImVsGTpifT2fFJcEH4lCcZsRQW2vxawZuNKexo-CUX_53WH3eyxO1O4d90RbS8l8-W-r-a1HocHk-wf6IG9ym6inNVyQoeJbHyvPlJE97aWmQQY-4M9SHpjys-w_NyFWSmE5VA6ACGGzRZMVbu1pV_Z29Q_HpiQbLuG-y9FQS1vO7LKFxak4cL6yw7m2gvHY_k4gG_xd97TRlqCiAq5NHffYexkOV7yspbon5nhANM0W2LelI6EJgYlc7qZVydzORavzXZ098po5KtNpxfX_yUN1b5FyO76Zd5fk5BFSvM-aBSbwSb1_U1HhVbNX2i3qZPjeh123';
		const actualRefreshToken = '91c925aba5204e048a50f0d7bcb1e123';

		const tokenObject = {
			access_token: actualToken,
			expires_in: 3599,
			refresh_token: actualRefreshToken,
			token_type: 'bearer',
		};

		// Act
		authService.setToken(tokenObject);

		// Assert
		expect(authService.calculateTokenExpiryDate).toHaveBeenCalled();
		expect(localStorage.getItem('access_token')).toBe(actualToken);
		expect(localStorage.getItem('refresh_token')).toBe(actualRefreshToken);
		expect(localStorage.getItem('expiry_date')).toBe('{"time_start":1509722766940, "time_end":1509726365940}');

	});

	it('Should Calculate Token Expiry Date', () => {
		// Arrange
		const startTime = '1509723996068';
		const expiresIn = '3599';
		const expectedExpriyDate = '15097239960683599000';

		// Act
		const actual = authService.calculateTokenExpiryDate(startTime, expiresIn);

		// Assert
		const expected = JSON.stringify({
			time_start: startTime,
			time_end: expectedExpriyDate
		});
		expect(actual).toBe(expected);
	});

	it('Should be able to login', () => {
		const endpoint = environment.apiBase + api.URLS.LOGIN;
		const returnObject = {
			access_token: 'BwD9xpmRzDDrLCKeVr1ImVsGTpifT2fFJcEH4lCcZsRQW2vxawZuNKexo-CUX_53WH3eyxO1O4d90RbS8l8-W-r-a1HocHk-wf6IG9ym6inNVyQoeJbHyvPlJE97aWmQQY-4M9SHpjys-w_NyFWSmE5VA6ACGGzRZMVbu1pV_Z29Q_HpiQbLuG-y9FQS1vO7LKFxak4cL6yw7m2gvHY_k4gG_xd97TRlqCiAq5NHffYexkOV7yspbon5nhANM0W2LelI6EJgYlc7qZVydzORavzXZ098po5KtNpxfX_yUN1b5FyO76Zd5fk5BFSvM-aBSbwSb1_U1HhVbNX2i3qZPjeh123',
			expires_in: 3599,
			refresh_token: '91c925aba5204e048a50f0d7bcb1e123',
			token_type: 'bearer',
		};

		authService
			.login({
				username: 'username',
				password: 'pass'
			})
			.subscribe((token: any) => {
				expect(token).toBeDefined();
				expect(token).toBe(returnObject);
			});

		httpMock.expectOne(endpoint)
			.flush(returnObject);

		httpMock.verify();
	});

	it('Should be able to logout', inject([Router], (router: Router) => {
		const routerSpy = spyOn(router, 'navigateByUrl');
		const deleteIdentitySpy = spyOn(authService, 'deleteIdentity').and.callThrough();
		const removeTokenSpy = spyOn(authService, 'removeToken').and.callThrough();
		const revokeTokenSpy = spyOn(authService, 'revokeToken').and.callThrough();

		authService.identity = getIdentityUtil();

		authService.logout();

		expect(revokeTokenSpy).toHaveBeenCalledTimes(1);
		expect(authService.identity).toBe(undefined);
		expect(routerSpy.calls.first().args[0]).toBe('/login');
		expect(deleteIdentitySpy).toHaveBeenCalledTimes(1);
		expect(removeTokenSpy).toHaveBeenCalledTimes(1);

	}));

	it('Should be able to refresh token', () => {
		// Arrange
		authService.isRefreshing = false;
		const currentTokenObject = {
			access_token: 'oldBwD9xpmRzDDrLCKeVr1ImV',
			expires_in: 3599,
			refresh_token: 'old91c925aba5204e048a50f0d7bcb1e123',
			token_type: 'bearer',
		};
		authService.setToken(currentTokenObject);

		const returnedTokenObject = {
			access_token: 'newBwD9xpmRzDDrLCKeVr1ImV',
			expires_in: 3599,
			token_type: 'bearer',
		};

		const endpoint = environment.apiBase + api.URLS.LOGIN;

		// Act
		authService.refreshToken();

		httpMock.expectOne(endpoint).flush(returnedTokenObject);
		httpMock.verify();

		// Assert
		expect(returnedTokenObject.access_token).toBe(localStorage.getItem('access_token'));

	});

	it('Should be able to revoke token', () => {
		const endpoint = environment.apiBase + api.URLS.LOGOUT;

		authService
			.revokeToken()
			.subscribe((token: any) => {
				expect(token).toBeDefined();
			});

		httpMock.expectOne(endpoint);

		httpMock.verify();
	});

	it('Should be able to delete Identity', () => {
		const removeTokenspy = spyOn(authService, 'removeToken');
		authService.identity = getIdentityUtil();

		authService.deleteIdentity();

		expect(authService.identity).toBe(undefined);
		expect(removeTokenspy).toHaveBeenCalled();
	});

	it('Should be able to delete Identity And Prompt Login',  inject([Router], (router: Router) => {
		// Arrange
		const deleteIdentitySpy = spyOn(authService, 'deleteIdentity');
		const routerSpy = spyOn(router, 'navigateByUrl');

		// Act
		authService.deleteIdentityAndPromptLogin();

		// Assert
		expect(authService.identity).toBe(undefined);
		expect(routerSpy.calls.first().args[0]).toBe('/login');
	}));

});
