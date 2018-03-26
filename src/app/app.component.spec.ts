import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';

describe('AppComponent', () => {
  let fixture;
  let comp;
  let authService;
  const authServiceStub = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
  };

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ AppComponent ], // declare the test component
      providers: [ {provide: AuthService, useValue: authServiceStub } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
  });

  it('Stub object and injected UserService should not be the same', () => {
    expect(authServiceStub === authService).toBe(false);
  });

  it('Title should be "Connect Admin"', () => {
    expect(comp.title).toEqual('App with Auth');
  });

  it('When isLoggedIn is executed authService.isLoggedIn called once', () => {
    comp.isLoggedIn();
    expect(authService.isLoggedIn.calls.count()).toBe(1, 'isLoggedIn called once');
  });

  it('isLoggedIn() returns same value as authService.isLoggedIn', () => {
    expect(comp.isLoggedIn()).toEqual(authService.isLoggedIn());
  });

});
