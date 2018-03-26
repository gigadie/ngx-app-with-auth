import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { Post } from './data_models/post.model';
import { PostsService } from './services/posts.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {
	loadingPosts: boolean;
	posts: Post[];

	constructor(private postsService: PostsService) { }

	ngOnInit() {
		this.loadingPosts = true;

		this.postsService
			.getPosts(5)
			.pipe(finalize(() => this.loadingPosts = false))
			.subscribe(
				(posts: Post[]) => this.posts = posts,
				(err) => console.log(err)
			);
	}

}
