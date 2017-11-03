import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-indicators',
	templateUrl: './indicators.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class IndicatorsComponent implements OnInit {

	data: any = [];

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Indicators',
			'Indicators integration for the Dride dashcam'
		)
		this.data = [
			`var indicators = require('dride-indicators')`,
			`indicators.startLoading();`,
			`indicators.stopLoading();`
		]
	}

}
