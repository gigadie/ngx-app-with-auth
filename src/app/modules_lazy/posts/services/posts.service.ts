import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { api } from '../../../config/api.config';
import { Observable } from 'rxjs/Observable';

import { Post } from '../data_models/post.model';

@Injectable()
export class PostsService {

	constructor(private http: HttpClient) { }

	getPosts(number: number): Observable<Post[]> {
		const url = environment.apiBase + api.URLS.POSTS.replace('$take', ''+number);

		return this.http.get<Post[]>(url);
	}
}
