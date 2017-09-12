import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { MixpanelService } from '../helpers/mixpanel.service';

@Component({
	selector: 'ngbd-modal-content',
	templateUrl: '../layout/templates/modal/payment/modal.html',
	styleUrls: ['../layout/templates/modal/payment/modal.scss']
})
export class NgbdModalPayement {
	@Input() name;
	qTitle: any;
	isLoaded = true;
	shareTxt = 'I just joined the waitlist for #dride. You should too! 🚗';
	constructor(public bsModalRef: BsModalRef, private router: Router, private route: ActivatedRoute, public mixpanel: MixpanelService) {

	}


	closeModal = function () {
		this.bsModalRef.hide();
	};


	dismissModal = function () {
		this.bsModalRef.hide();
	};



	tweet = function () {

		let urlString = 'https://www.twitter.com/intent/tweet?';
		urlString += 'text=' + encodeURIComponent(this.shareTxt);
		urlString += '&hashtags=' + encodeURIComponent('connected_dashcam');

		// default to the current page if a URL isn't specified
		urlString += '&url=' + encodeURIComponent('https://dride.io/store');

		window.open(
			urlString,
			'Twitter', 'toolbar=0,status=0,resizable=yes,width=500,height=600,top='
			+ (window.innerHeight - 600) / 2 + ',left=' + (window.innerWidth - 500) / 2);
		this.mixpanel.track('twitted from store', {});

	}


}
