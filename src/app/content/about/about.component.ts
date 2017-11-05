import { Component, OnInit } from '@angular/core';
import { introAnim } from '../../router.animations';
import { MetaService } from '../../helpers/meta/meta.service'



@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
	animations: [introAnim]
})
export class AboutComponent implements OnInit {

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set('About', 'About Dride,Inc.', 'article')
	}

}
