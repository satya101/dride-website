import { Component, OnInit } from '@angular/core';
import { MixpanelService } from '../../../helpers/mixpanel/mixpanel.service';

@Component({
	selector: 'app-getting-started',
	templateUrl: './getting-started.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class GettingStartedComponent implements OnInit {

	constructor(public mixpanel: MixpanelService) { }
	data: any = [];
	ngOnInit() {

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
