import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-thread-block',
	templateUrl: './thread-block.component.html',
	styleUrls: ['./thread-block.component.scss']
})
export class ThreadBlockComponent implements OnInit {
	@Input() post: any;
	@Input() fromSearch: boolean;

	constructor() {}

	ngOnInit() {}
}
