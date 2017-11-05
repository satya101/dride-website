import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-dride-cloud',
	templateUrl: './dride-cloud.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class DrideCloudComponent implements OnInit {

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Dride-Cloud',
			'Access Dride-Cloud programmatically'
		)
	}

}
