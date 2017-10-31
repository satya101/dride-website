import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-assembly',
	templateUrl: './assembly.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class AssemblyComponent implements OnInit {

	data: any = [];

	constructor() { }

	ngOnInit() {

		this.data = [
			`$ dride publish`
		]

	}

}
