import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './config/posts-routing.module';

import { SharedModule } from '../../modules/shared/shared.module';

import { PostsService } from './services/posts.service';

import { PostsComponent } from './posts.component';

@NgModule({
	imports: [
		CommonModule,
		PostsRoutingModule,
		SharedModule
	],
	declarations: [
		PostsComponent
	],
	providers: [
		PostsService
	]
})
export class PostsModule { }
