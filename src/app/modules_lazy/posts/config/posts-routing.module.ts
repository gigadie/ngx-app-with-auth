import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { PostsComponent } from '../posts.component';

export const routes: Routes = [
	{
		path: 'posts',
		component: PostsComponent,
		data: { features: ['posts'], permissions: [] }
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class PostsRoutingModule {}
