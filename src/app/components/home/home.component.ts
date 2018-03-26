import { Component, OnInit } from '@angular/core';
import { User } from '../../data_models/userprofile.model';
import { AuthService } from '../../modules/auth/services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	user: User;

	constructor(private authService: AuthService) { }

	ngOnInit() {
		this
			.authService
			.getIdentity()
			.then(user => this.user = user)
			.catch(err => console.log(err));
	}
}
