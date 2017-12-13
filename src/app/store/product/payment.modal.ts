import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from '../../auth.service';
import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';

import * as firebase from 'firebase/app'; // for typings
import { SsrService } from '../../helpers/ssr/ssr.service'


@Component({
	selector: 'ngbd-modal-content',
	templateUrl: '../../layout/templates/modal/payment/modal.html',
	styleUrls: ['../../layout/templates/modal/payment/modal.scss']
})
export class NgbdModalPayement {
	@Input() name;
	productId: string;
	qTitle: any;
	isLoaded = true;
	canBuy = false;
	shareTxt = 'I just joined the waitlist for #dride. You should too!';
	constructor(public bsModalRef: BsModalRef,
		private router: Router,
		private route: ActivatedRoute,
		public mixpanel: MixpanelService,
		private auth: AuthService,
		public ssr: SsrService) {

		mixpanel.track('opened buy for ' + this.productId, {});
		this.auth.verifyLoggedIn().then(res => {
			firebase.database().ref('queue/' + res['uid'] + '/email').set(res['email'])
			firebase.database().ref('queue/' + res['uid'] + '/date').push({dte: (new Date).getTime()})
			this.onShow()
		})


	}

	onShow() {
		this.canBuy = this.bsModalRef.content.title === 'dride-kit' ? true : false;
		console.log(this.bsModalRef.content.title)
	}

	setProductId(productId) {
		this.productId = productId
	}

	closeModal() {
		this.bsModalRef.hide();
	};


	dismissModal() {
		this.bsModalRef.hide();
	};



	tweet() {
		if (!this.ssr.isBrowser()) { return }

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
