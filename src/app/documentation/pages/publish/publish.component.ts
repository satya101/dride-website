import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-publish',
	templateUrl: './publish.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class PublishComponent implements OnInit {

	data: any = [];

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Publish a Dride app',
			'Publish a Dride app to the Dride eco-system'
		)
		this.data = [
			`$ dride publish`
		]

	}

}
