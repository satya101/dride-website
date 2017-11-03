import { Component, OnInit } from '@angular/core';
import { SsrService } from '../helpers/ssr/ssr.service'
import { MetaService } from '../helpers/meta/meta.service'

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

	isMobile = '1';
	constructor(public ssr: SsrService, private meta: MetaService) {

		this.isMobile = '1'
		if (this.ssr.isBrowser()) {
			this.isMobile = window.innerWidth <= 991 ? '2' : '1'
		}
	}

	ngOnInit() {
		this.meta.set(
			'Store',
			'Visit the official Dride site and find the world\'s first connected dashcam. Share videos with the world to create a better driving community. Dride'
		)
	}


}
