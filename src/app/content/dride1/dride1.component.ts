import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { MetaService } from '../../helpers/meta/meta.service'

@Component({
	selector: 'app-dride1',
	templateUrl: './dride1.component.html',
	styleUrls: ['./dride1.component.scss']
})
export class Dride1Component implements OnInit {

	preSubmit = true

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Features',
			'Dride is the worlds first connected dashcam with safety alerts and apps.'
		)
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
