import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { MetaService } from '../../helpers/meta/meta.service'

@Component({
	selector: 'app-zero',
	templateUrl: './zero.component.html',
	styleUrls: ['./zero.component.scss']
})
export class ZeroComponent implements OnInit {

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
			this.mixpanel.track('subscribed', {location: 'Zero', email: email});
		});

	}

}
