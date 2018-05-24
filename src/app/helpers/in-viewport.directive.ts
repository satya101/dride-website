import { fromEvent as observableFromEvent ,  Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Directive, OnInit, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';

import { SsrService } from '../helpers/ssr/ssr.service';
@Directive({
	selector: '[in-viewport]'
})
export class InViewport implements OnInit, OnDestroy {
	private scroll: any;
	private resize: any;

	@Output('inViewport') inViewport: EventEmitter<Object>;

	constructor(private _el: ElementRef, public ssr: SsrService) {
		if (this.ssr.isBrowser()) {
			this.inViewport = new EventEmitter();
		}
	}

	ngOnInit() {
		if (this.ssr.isBrowser()) {
			this.check();

			this.scroll = observableFromEvent(window, 'scroll')
				.pipe(debounceTime(100))
				.subscribe(event => {
					this.check();
				});

			this.resize = observableFromEvent(window, 'resize')
				.pipe(debounceTime(100))
				.subscribe(event => {
					this.check();
				});
		}
	}

	ngOnDestroy() {
		if (this.ssr.isBrowser()) {
			this.scroll.unsubscribe();
			this.resize.unsubscribe();
		}
	}

	check(partial: boolean = true, direction: string = 'both') {
		if (this.ssr.isBrowser()) {
			const el = this._el.nativeElement;

			const elSize = el.offsetWidth * el.offsetHeight;

			const rec = el.getBoundingClientRect();

			const vp = {
				width: window.innerWidth,
				height: window.innerHeight
			};

			const tViz = rec.top >= 0 && rec.top < vp.height;
			const bViz = rec.bottom > 0 && rec.bottom <= vp.height;

			const lViz = rec.left >= 0 && rec.left < vp.width;
			const rViz = rec.right > 0 && rec.right <= vp.width;

			const vVisible = partial ? tViz || bViz : tViz && bViz;
			const hVisible = partial ? lViz || rViz : lViz && rViz;

			const event = {
				target: el,
				value: false
			};

			if (direction === 'both') {
				event['value'] = elSize && vVisible && hVisible ? true : false;
			} else if (direction === 'vertical') {
				event['value'] = elSize && vVisible ? true : false;
			} else if (direction === 'horizontal') {
				event['value'] = elSize && hVisible ? true : false;
			}

			this.inViewport.emit(event);
		}
	}
}
