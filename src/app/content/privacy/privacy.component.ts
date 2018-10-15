import { Component, OnInit } from '@angular/core';

import { environment } from 'environments/environment';
import { MetaService } from '../../helpers/meta/meta.service';
import { SsrService } from '../../helpers/ssr/ssr.service';

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html',
	styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
	constructor(private meta: MetaService, public ssr: SsrService) {}

	ngOnInit() {
		this.meta.set('Privacy', 'Privacy policy for using Dride services');
	}
}
