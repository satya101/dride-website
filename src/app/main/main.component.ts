import { Component, OnInit } from '@angular/core';

import { introAnim } from '../router.animations';
import { HttpClient } from '@angular/common/http';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { PageScrollConfig } from 'ng2-page-scroll';
import { InViewport } from '../helpers/in-viewport.directive';
import { environment } from '../../environments/environment';
import { MixpanelService } from '../helpers/mixpanel.service';


@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
	animations: [introAnim]
})
export class MainComponent implements OnInit {

	public show: any = [false, false, false, false, false, false, false, false];
	displayCard = 0
	preSubmit = true
	isLoaded = false
	currentElementInView = 0

	constructor(private http: HttpClient, public mixpanel: MixpanelService) {

		PageScrollConfig.defaultDuration = 800;
		PageScrollConfig.defaultEasingLogic = {
			ease: (t: number, b: number, c: number, d: number): number => {
				// easeInOutExpo easing
				if (t === 0) return b;
				if (t === d) return b + c;
				if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
			}
		};
	}

	action(event, pos) {
		if (event) {
			this.currentElementInView = pos - 1
			this.show.fill(false)
			this.show[pos] = true;
		}
	}

	ngOnInit() {
		this.isLoaded = true;
	}

	sendDetails = function (email) {

		// subscribe users
		const url = environment.functionsURL + '/subscriber?email=' + email;
		this.http.get(url).subscribe(data => {
			this.preSubmit = false;
			this.mixpanel.track('subscribed', {location: 'HP', email: email});
		});

	}
}
