import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../helpers/meta/meta.service'

@Component({
	selector: 'app-3rd-party',
	templateUrl: './3rd-party.component.html',
	styleUrls: ['./3rd-party.component.scss']
})
export class TPartyComponent implements OnInit {

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Dride Universal',
			'Dride Universal is an app that connects with multiple dashcams offering Dride-Cloud for all.'
		)
	}

}
