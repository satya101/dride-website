import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'docs-universal',
	templateUrl: './universal.component.html',
	styleUrls: ['../../documentation.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UniversalComponent implements OnInit {
	public data = [];

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Dride-Universal',
			'Integrating 3rd party dashcams with Dride-universal'
		)
		this.data = [
			`{ "status": "1"}`,
			`{ "status": "1"}`,
			`{ "status": "1"}`,
			`{ "status": "1"}`,
		]

	}

}
