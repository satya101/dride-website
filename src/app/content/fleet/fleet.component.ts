import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../helpers/meta/meta.service'

@Component({
	selector: 'app-fleet',
	templateUrl: './fleet.component.html',
	styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Dride Fleet',
			'Dride Fleet is our fleet management solution'
		)
	}

}
