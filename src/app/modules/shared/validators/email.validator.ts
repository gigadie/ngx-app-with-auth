import { AbstractControl } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

export function emailValidator(http: HttpClient) {

	return (control: AbstractControl): Observable<any> => {
		function checkCode(data) {
			let controlErrors = null;

			if (data.code) {
				switch (data.code) {
					case 'NotAllowed':
						controlErrors = { blockeddomain: true };
						break;
					case 'AlreadyRegistered':
						controlErrors = { alreadytaken: true };
						break;
					case 'InvalidEmail':
						controlErrors = { email: true };
						break;
					default:
						controlErrors = null;
				}
			}

			return controlErrors;
		}

		return http
			.post(environment.apiBase + '/api/email/validate', {email: control.value})
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				map(code => checkCode(code))
			);
	};
}
