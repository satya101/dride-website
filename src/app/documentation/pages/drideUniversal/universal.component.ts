import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'docs-universal',
	templateUrl: './universal.component.html',
	styleUrls: ['../../documentation.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UniversalComponent implements OnInit {
	public data = [];
	constructor() { }

	ngOnInit() {

		this.data = [
			`{ "status": "1"}`,
			`{ "status": "1"}`,
			`{ "status": "1"}`,
			`{ "status": "1"}`,
		]

	}

}
