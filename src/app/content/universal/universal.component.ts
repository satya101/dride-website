import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { MetaService } from '../../helpers/meta/meta.service';
import { SsrService } from '../../helpers/ssr/ssr.service';

@Component({
	selector: 'app-universal',
	templateUrl: './universal.component.html',
	styleUrls: ['./universal.component.scss']
})
export class UniversalComponent implements OnInit {
	constructor(private meta: MetaService, public ssr: SsrService) {}

	ngOnInit() {
		this.meta.set('Features', 'Dride is the worlds smallest connected dashcam with a Share Button.');
	}
}
