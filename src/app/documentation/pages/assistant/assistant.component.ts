import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-assistant',
	templateUrl: './assistant.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class AssistantComponent implements OnInit {

	data: any = [];

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Assistant',
			'Assistant integration for the Dride dashcam [Alexa, Google Home]'
		)
		this.data = [
			`var assistant = require('dride-alexa')`
		]
	}

}
