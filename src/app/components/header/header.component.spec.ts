import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
/* Material */
import { RouterTestingModule } from '@angular/router/testing';
import { getIdentityUtil } from '../../../testing/get-identity.utility';
import { AuthService } from '../../modules/auth/services/auth.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
	let fixture, comp, authService;
	const authServiceStub = {
		isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
		logout: jasmine.createSpy('logout').and.returnValue(true),
	};

	// async beforeEach
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule ],
			declarations: [ HeaderComponent ], // declare the test component
			providers: [ {provide: AuthService, useValue: authServiceStub } ],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		})
		.compileComponents();  // compile template and css
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		comp = fixture.componentInstance;
		authService = fixture.debugElement.injector.get(AuthService);
	});

	it('Should be able to call auth service to logout', () => {
		comp.logout();
		expect(authService.logout).toHaveBeenCalledTimes(1);
	});

	it('isLoggedIn() returns same value as authService.isLoggedIn', () => {
		expect(comp.isLoggedIn()).toEqual(authService.isLoggedIn());
	});

	it('imageUrl() returns default image when userprofile dont have an image url', () => {
		comp.user = null;
		expect(comp.imageUrl()).toEqual('./assets/user_profile.png');
	});

	it('imageUrl() returns correct image when userprofile have an image url', () => {
		comp.user = getIdentityUtil();
		expect(comp.imageUrl()).toEqual('/path/to/person_profile_image');
	});
});
