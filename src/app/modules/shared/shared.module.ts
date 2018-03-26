import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Services */
import { BrowserDetectorService } from './services/browser-detector.service';

/* Components */
import { DropDownListComponent } from './components/drop-down-list/drop-down-list.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';


@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		DropDownListComponent,
		BreadcrumbsComponent
	],
	exports: [
		DropDownListComponent,
		BreadcrumbsComponent
	],
	providers: [
		BrowserDetectorService
	]
})
export class SharedModule { }
