import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpHandler } from '@angular/common/http';

import { PostsService } from './posts.service';

describe('PostsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpClientTestingModule ],
			providers: [PostsService]
		});
	});

	it('should be created', inject([PostsService], (service: PostsService) => {
		expect(service).toBeTruthy();
	}));
});
