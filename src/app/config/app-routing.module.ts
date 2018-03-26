import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../modules/auth/services/auth-guard.service';

import { ErrorComponent } from '../components/error/error.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';

export const routes: Routes = [
	// DEFAULT ROUTE
	{ path: '', redirectTo: '/home', pathMatch: 'full'},
	// AUTHORISATION REQUIRED
	{
		path: '',
		canActivate: [ AuthGuard ],
		children: [
			{
				path: '',
				canActivateChild: [ AuthGuard ],
				children: [
					{ path: 'home', component: HomeComponent, data: { features: ['home'], permissions: [] } },
					{ path: 'error', component: ErrorComponent, data: { features: [], permissions: [] } },
					{ path: '', loadChildren: 'app/modules_lazy/posts/posts.module#PostsModule' },
					// { path: '', loadChildren: 'app/modules_lazy/settings/settings.module#SettingsModule' },
				],
			},
		],
	},
	// AUTHORISATION NOT REQUIRED
	{ path: 'login', component: LoginComponent },
	// WILDCARD ROUTE
	{ path: '**', redirectTo: '/home'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
