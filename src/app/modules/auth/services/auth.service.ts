import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../../data_models/userprofile.model';
import { api } from '../../../config/api.config';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, catchError, finalize, last } from 'rxjs/operators';

@Injectable()
export class AuthService {

	public isRefreshing: boolean;

	public identity: User;

	public redirectUrl: string;

	private _userSource: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	public user$: Observable<User> = this._userSource.asObservable();

	constructor(private http: HttpClient, private router: Router ) { }

	login(userLogin: any): Observable<Object> {
		const body = new HttpParams()
			.set('grant_type', 'password')
			.set('username', userLogin.username)
			.set('password', userLogin.password)
			.toString();

		const headers = new HttpHeaders()
			.set('accept', 'application/json')
			.set('content-type', 'application/x-www-form-urlencoded; charset=utf-8');

		return this
			.http
			.post(environment.apiBase + api.URLS.LOGIN, body, {
				headers: headers
			})
			.pipe(
				map(this.extractData.bind(this)),
				catchError(this.onTokenError),
				last()
			);
	}

	private extractData(res: Response) {
		this.setToken(res);
		return res || {};
	}

	logout() {
		this.revokeToken()
			.subscribe(() => {});

		this.deleteIdentityAndPromptLogin();
	}

	calculateTokenExpiryDate(startTime, expiresIn) {
		return JSON.stringify({
			time_start: startTime,
			time_end: startTime + expiresIn * 1000
		});
	}

	setAccessToken(tokens: any) {
		const now = (new Date()).getTime();

		localStorage.setItem('access_token', tokens.access_token);

		localStorage.setItem('expiry_date', this.calculateTokenExpiryDate(now, tokens.expires_in));
	}

	setToken(tokens: any) {
		localStorage.setItem('refresh_token', tokens.refresh_token);

		this.setAccessToken(tokens);
	}

	refreshToken() {
		if (!this.isRefreshing) {

			this.isRefreshing = true;

			if (localStorage.getItem('refresh_token')) {
				const body = new HttpParams()
					.set('grant_type', 'refresh_token')
					.set('refresh_token', localStorage.getItem('refresh_token'))
					.toString();

				const headers = new HttpHeaders()
					.set('accept', 'application/json')
					.set('content-type', 'application/x-www-form-urlencoded; charset=utf-8');

				this
					.http
					.post(environment.apiBase + api.URLS.LOGIN, body, {
						headers: headers
					})
					.pipe(
						finalize(() => this.isRefreshing = false)
					)
					.subscribe(
						data => this.setAccessToken(data),
						err => this.onTokenError(err)
					);
			} else {
				// cannot refresh so it needs to re-authorize user
				this.deleteIdentityAndPromptLogin();
			}
		}
	}

	onTokenError(error: any) {
		const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		// we could give the user a message here

		return ErrorObservable.create(new Error(errMsg));
	}

	removeToken() {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('expiry_date');
	}

	revokeToken(): Observable<any> {
		const headers = new HttpHeaders()
			.set('accept', 'application/json');

		return this
			.http
			.post(environment.apiBase + api.URLS.LOGOUT, { headers: headers });
	}

	getIdentity(): Promise<User> {
		return new Promise<User>((resolve: (res: User) => void, reject: (err: Error) => void) => {

			if (!this.isAuthenticated()) {
				this.deleteIdentity();
				return reject(new Error('Unauthorized request'));
			}

			if (this.isLoggedIn()) {
				if (environment.production && window.ga) {
					window.ga('set', 'userId', this.identity.userProfile.id);
				}
				return resolve(this.identity);
			}

			const headers = new HttpHeaders()
				.set('accept', 'application/json')
				.set('content-type', 'application/json; charset=utf-8');

			this
				.http
				.get<User>(environment.apiBase + api.URLS.USER, { headers: headers })
				.subscribe(
					data => {
						this.setIdentity(data);
						resolve(this.identity);
					},
					err => {
						this.deleteIdentity();
						reject(new Error('Unauthorized request'));
					}
				);
		});
	}

	updateUserProfileImage(imageUrl: string): void {
		if (this.isLoggedIn()) {
			this.identity.userProfile.imageUrl = imageUrl;
			this._userSource.next(this.identity);
		}
	}

	isAuthenticated(): boolean {
		return !!localStorage.getItem('access_token');
	}

	isLoggedIn(): boolean {
		return this.isAuthenticated() && !!this.identity;
	}

	setIdentity(data: User) {
		this.identity = new User();

		this.identity.userProfile = data.userProfile;
		this.identity.features = data.features;
		this.identity.permissions = data.permissions;

		if (environment.production && window.ga) {
			window.ga('set', 'userId', this.identity.userProfile.id);
		}

		this._userSource.next(this.identity);
	}

	deleteIdentity() {
		this.identity = undefined;
		this.removeToken();
	}

	deleteIdentityAndPromptLogin() {
		this.deleteIdentity();
		this.redirectUrl = this.router.url !== '/login' ? this.router.url : null;
		this.router.navigateByUrl('/login', { skipLocationChange: true });
	}

}
