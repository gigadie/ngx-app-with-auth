import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

// items: [
// 	{
// 		title: 'My Feeds',
// 		routerLink: ['/rsb',{outlets:{'left':['feed'], 'right':['suggested-connections']}}]
// 	},
// 	{
// 		title: 'HNW Guide',
// 		url: `https://www.chambersandpartners.com/high-net-worth-guide`
// 	}
// ]

@Component({
	selector: 'app-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styleUrls: ['./breadcrumbs.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BreadcrumbsComponent implements OnInit {

	@Input('items') items: any[];

	constructor() { }

	ngOnInit() {
	}

}
