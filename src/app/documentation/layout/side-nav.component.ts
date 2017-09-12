import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DocsMainComponent } from '../pages/main.component';
import { AdasComponent } from '../pages/adas.component';
import { AssistantComponent } from '../pages/assistant.component';
import { ConnectivityComponent } from '../pages/connectivity.component';
import { DrideCloudComponent } from '../pages/dride-cloud.component';
import { GettingStartedComponent } from '../pages/getting-started.component';
import { IndicatorsComponent } from '../pages/indicators.component';
import { ManualSetupComponent } from '../pages/manual-setup.component';
import { PublishComponent } from '../pages/publish.component';


@Component({
	selector: 'docs-side-nav',
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

	public docMenu: any[]
	public currentPage = 'x';

	constructor(private route: ActivatedRoute) {

		this.docMenu = [
			{
				'url': 'getting_started',
				'ttl': 'Getting Started',
				'icon': 'icon-toyCar-1',
				'more': '',
				'hp': true,
				'menu': true,
				'component': GettingStartedComponent
			},
			{
				'url': 'dride_cloud',
				'ttl': 'Dride Cloud',
				'icon': 'icon-cloud',
				'more': 'A network of driving footage',
				'hp': true,
				'menu': true,
				'component': DrideCloudComponent
			},
			{
				'url': 'adas',
				'ttl': 'ADAS',
				'icon': 'icon-camera',
				'more': 'Access the road programmatically',
				'hp': true,
				'menu': true,
				'component': AdasComponent
			},
			{
				'url': 'assistant',
				'ttl': 'Assistant',
				'icon': 'icon-mic',
				'more': 'Use Dride’s voice engine',
				'hp': true,
				'menu': true,
				'component': AssistantComponent
			},
			{
				'url': 'connectivity',
				'ttl': 'Connectivity',
				'icon': 'icon-wifi',
				'more': 'GPS, Bluetooth & Wifi',
				'hp': true,
				'menu': true,
				'component': ConnectivityComponent
			},
			{
				'url': 'indicators',
				'ttl': 'Indicators',
				'icon': 'icon-indicator',
				'more': 'Control Dride’s light indicators',
				'hp': true,
				'menu': true,
				'component': IndicatorsComponent
			},
			{
				'url': 'publish',
				'ttl': 'Publish',
				'icon': 'icon-app',
				'more': 'Learn how to publish an app to Dride',
				'hp': false,
				'menu': true,
				'component': PublishComponent
			},
			{
				'url': 'manual_setup',
				'ttl': 'Manual Setup',
				'hp': false,
				'menu': false,
				'component': ManualSetupComponent
			}
		];


	}

	ngOnInit() {

		this.route.params.subscribe(params => {
			this.currentPage = params.slug;
		});

	}
}
