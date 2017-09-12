import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs/Rx';

import { MixpanelService } from './helpers/mixpanel.service';

import { MetaService } from '@ngx-meta/core';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	routerSubscription: Subscription;


	constructor(private router: Router, public mixpanel: MixpanelService) {

	}

	ngOnInit() {
		if (isPlatformBrowser) {
			this.routerSubscription = this.router.events
				.filter(event => event instanceof NavigationEnd)
				.subscribe(event => {
					this.mixpanel.track(this.router.url, {});
					window.scrollTo(0, 0);
				});
		}
	}

	ngOnDestroy() {
		this.routerSubscription.unsubscribe();
	}


}
