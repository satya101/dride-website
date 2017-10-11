import { Component, OnInit } from '@angular/core';
import { SsrService } from '../helpers/ssr/ssr.service'

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

	isMobile = '1';
	constructor(public ssr: SsrService) {

		this.isMobile = '1'
		if (this.ssr.isBrowser()) {
			this.isMobile = window.innerWidth <= 991 ? '2' : '1'
		}
	}

	ngOnInit() {
	}


}
