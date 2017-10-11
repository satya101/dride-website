import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs/Rx';

import { MixpanelService } from './helpers/mixpanel/mixpanel.service';

import { MetaService } from '@ngx-meta/core';
import { SsrService } from './helpers/ssr/ssr.service'



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	routerSubscription: Subscription;


	constructor(private router: Router, public mixpanel: MixpanelService, public ssr: SsrService) {

	}

	ngOnInit() {
		if (this.ssr.isBrowser()) {
			this.routerSubscription = this.router.events
				.filter(event => event instanceof NavigationEnd)
				.subscribe(event => {
					this.mixpanel.track(this.router.url, {});

					if (this.ssr.isBrowser()) {
						window.scrollTo(0, 0);
					}
				});
		}
	}

	ngOnDestroy() {
		if (!this.ssr.isBrowser()) { return }

		this.routerSubscription.unsubscribe();
	}


}
