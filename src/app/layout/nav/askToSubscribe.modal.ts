
import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient } from '@angular/common/http';

import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';

import * as firebase from 'firebase/app'; // for typings
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from 'angular2-notifications';


import {
	AngularFireDatabase,
	FirebaseListObservable
} from 'angularfire2/database';


@Component({
	selector: 'ngbd-modal-content',
	templateUrl: '../../layout/templates/modal/AskToSubscribe/modal.html',
	styleUrls: ['../../layout/templates/modal/AskToSubscribe/modal.scss']
})
export class NgbdModalAskToSubscribe {
	@Input() name;
	qTitle: any;
	public isLoaded = false;
	showDanger = false;
	public firebaseUser: any;
	public email: string;


	constructor(
		public bsModalRef: BsModalRef,
		public mixpanel: MixpanelService,
		private http: HttpClient,
		private cookieService: CookieService,
		private notificationsService: NotificationsService
	) {

	}

	onShown() {
		this.isLoaded = true;
	}

	closeModal = function () {
		this.bsModalRef.hide();
		this.cookieService.set('subscribed', true);
	};

	sendDetails = function (email) {
		// subscribe users
		const url = environment.functionsURL + '/subscriber?email=' + email;
		this.http.get(url).subscribe(data => {
			this.cookieService.set('subscribed', true);
			this.mixpanel.track('subscribed', { location: 'popUp', email: email });

			this.notificationsService.success('Thank you!', 'We will let you know when we\'re ready', {
				timeOut: 3000,
				showProgressBar: true,
				pauseOnHover: true,
				clickToClose: true
			});

		});
		this.closeModal()

	}

}
