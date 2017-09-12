import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';


@Component({
	selector: 'app-dride1',
	templateUrl: './dride1.component.html',
	styleUrls: ['./dride1.component.scss']
})
export class Dride1Component implements OnInit {

	preSubmit = true

	constructor() {
	}

	ngOnInit() {
	}

	sendDetails = function (email) {

		// subscribe users
		const url = environment.functionsURL + '/subscriber?email=' + email;
		this.http.get(url).subscribe(data => {
			this.preSubmit = false;
			this.mixpanel.track('subscribed', {location: 'dride1', email: email});
		});

	}

}
