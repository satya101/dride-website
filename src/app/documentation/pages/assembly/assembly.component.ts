import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-assembly',
	templateUrl: './assembly.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class AssemblyComponent implements OnInit {

	data: any = [];

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Assembly',
			'How to assemble Dride'
		)
		this.data = [
			`$ dride publish`
		]

	}

}
