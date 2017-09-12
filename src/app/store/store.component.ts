import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

	isMobile = '1';
	constructor() {
		this.isMobile = window.innerWidth <= 991 ? '2' : '1'
	}

	ngOnInit() {
	}


}
