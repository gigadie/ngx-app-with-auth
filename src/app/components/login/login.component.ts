import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/services/auth.service';

/* Forms */
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	userForm: FormGroup;
	loggingIn: boolean;
	get username() { return this.userForm.get('username'); }
	get password() { return this.userForm.get('password'); }

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit() {
		this.userForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
			password:  new FormControl('', [Validators.required]),
		});
	}

	onSubmit() {
		Object.keys(this.userForm.controls)
			.forEach((field: string) => {
				const control = this.userForm.get(field);
				control.markAsDirty({ onlySelf: true });
				control.markAsTouched({ onlySelf: true });
			});

		if (!this.userForm.invalid) {
			this.loggingIn = true;
			this
				.authService
				.login({
					username: this.username.value,
					password: this.password.value
				})
				.pipe(
					finalize(() => this.loggingIn = false),
				)
				.subscribe(
					(data) => this.redirectToHome(),
					(err) => console.log(err),
				);
		}
	}

	redirectToHome() {
		// return to previous state or default
		const url = (this.authService && this.authService.redirectUrl) || '/home';
		this.router.navigateByUrl(url);
	}
}
