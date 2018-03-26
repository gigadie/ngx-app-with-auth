import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { finalize } from 'rxjs/operators';
import { AuthService } from './../../modules/auth/services/auth.service';
import { LoginComponent } from './login.component';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

// ADDED CLASS
class MockRouter {
	navigateByUrl(url: string) { return url; }
}

describe('LoginComponent', () => {
	let fixture, comp, authService;

	// async beforeEach
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule ],
			declarations: [ LoginComponent ], // declare the test component
			providers: [
				AuthService,
				{ provide: Router, useClass: MockRouter },
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		})
		.compileComponents();  // compile template and css
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		comp = fixture.componentInstance;
		authService = fixture.debugElement.injector.get(AuthService);
	});

	it('Should be able to submit login form', inject([Router], (router: Router)  => {
		comp.userForm = new FormGroup({
			username: new FormControl('username'),
			password:  new FormControl('pass'),
		});

		const loginServiceSpy = spyOn(authService, 'login').and.callThrough();

		comp.onSubmit();

		expect(loginServiceSpy).toHaveBeenCalledTimes(1);
	}));

	it('Should redriect to home after login', inject([Router], (router: Router)   => {
		const routerSpy = spyOn(router, 'navigateByUrl');
		comp.redirectToHome();
		expect(routerSpy.calls.first().args[0]).toBe('/home');
	}));

});
