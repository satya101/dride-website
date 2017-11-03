import { Component, OnInit } from '@angular/core';
import { MixpanelService } from '../../../helpers/mixpanel/mixpanel.service';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-getting-started',
	templateUrl: './getting-started.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class GettingStartedComponent implements OnInit {

	data: any = [];

	constructor(public mixpanel: MixpanelService, private meta: MetaService) {
	}


	ngOnInit() {
		this.meta.set(
			'Getting Started',
			'Getting started guide about how to build a connected dashcam with Dride & RaspberryPi'
		)
		this.data = [
			`dride/
├── package.json
│
├── node_modules/
│   ├── dride-ws/
│   ├── dride-core/
│   ├── dride-connectivity/
│   ├── dride-indicators/
│   ├── dride-cloud/
│   ├── dride-alexa/
│   └── ...
├── daemons/
│   ├── gps/
│   ├── bluetooth/
│   └── ...
├── startup.js
│
└── ...`
		]


	}

	track(what, parms = {}) {
		this.mixpanel.track('download ' + what, parms);
	}

}
