import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-connectivity',
	templateUrl: './connectivity.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class ConnectivityComponent implements OnInit {

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Connectivity',
			'Connectivity integration for the Dride dashcam'
		)
	}

}
