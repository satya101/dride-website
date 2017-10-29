
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { AuthService } from '../auth.service';
import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';

import * as firebase from 'firebase/app'; // for typings
import { SsrService } from '../helpers/ssr/ssr.service'

import {
	AngularFireDatabase,
	FirebaseListObservable
} from 'angularfire2/database';


@Component({
	selector: 'ngbd-modal-content',
	templateUrl: '../layout/templates/modal/askInForum/modal.html',
	styleUrls: ['../layout/templates/modal/askInForum/modal.scss']
})
export class NgbdModalAskInForum {
	@Input() name;
	qTitle: any;
	public isLoaded = false;
	showDanger = false;
	public firebaseUser: any;

	constructor(
		public bsModalRef: BsModalRef,
		public db: AngularFireDatabase,
		private auth: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		public mixpanel: MixpanelService
	) {

		auth.getState().subscribe(OurUser => {
			if (!OurUser) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = OurUser;

		});

	}

	onShown() {
		this.isLoaded = true;
	}

	closeModal = function () {
		this.bsModalRef.hide();
	};

	dismissModal = function () {
		this.bsModalRef.dismiss();
	};

	slugify(text, id) {
		return (
			text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') + '__' + id
		);
	}
	openThread = (title) => {
		this.auth.verifyLoggedIn().then(result => {
			if (!title) {
				this.showDanger = true;
				return;
			}

			// add a new thread on Firebase
			this.db
				.list('/threads')
				.push({
					title: title,
					created: new Date().getTime(),
					views: 0,
					participants: [this.firebaseUser.uid],
					description: '',
					cmntsCount: 1,
					lastUpdate: new Date().getTime()
				})
				.then(ref => {
					this.db
						.object('/threads/' + ref.key)
						.update({ slug: this.slugify(title, ref.key) })
						.then(res => {
							this.closeModal();
							// $location.path('thread/' + $scope.slugify(title, ref.key));
							this.router.navigate(
								['/thread/' + this.slugify(title, ref.key)],
								{ relativeTo: this.route }
							);
							this.mixpanel.track('posted a new post', {});
						});
				});
		});
	};
}
