import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

/**
 * Generated class for the ScrubSliderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'scrub-slider',
	templateUrl: 'scrub-slider.html',
	styleUrls: ['./scrub-slider.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ScrubSliderComponent implements OnInit {
	@Input('currentTime')
	currentTime: number;
	@Input('total')
	total: number;
	@Input('buffered')
	buffered: any;
	@Input('cue')
	cue: number;
	@Output()
	timeChange: EventEmitter<number>;
	options: Options;

	public value = 10;

	constructor() {
		this.timeChange = new EventEmitter<number>();
	}

	ngOnInit() {
		this.total = this.total / 1000;
		this.options = {
			floor: 0,
			ceil: this.total
		};
	}
	change() {
		this.timeChange.emit(this.currentTime);
	}
}
