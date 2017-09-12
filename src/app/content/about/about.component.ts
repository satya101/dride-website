import { Component, OnInit } from '@angular/core';
import { introAnim } from '../../router.animations';



@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
	animations: [introAnim]
})
export class AboutComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

}
