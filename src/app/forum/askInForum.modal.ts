import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from '../auth.service';
import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';

import { AngularFirestore } from 'angularfire2/firestore';

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
	public busy = false;

	constructor(
		public bsModalRef: BsModalRef,
		public db: AngularFirestore,
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

	closeModal = function() {
		this.bsModalRef.hide();
	};

	dismissModal = function() {
		this.bsModalRef.dismiss();
	};

	slugify(text, id) {
		return (
			text
				.toLowerCase()
				.replace(/[^\w ]+/g, '')
				.replace(/ +/g, '-') +
			'____' +
			id
		);
	}
	openThread = title => {
		this.auth.verifyLoggedIn().then(result => {
			if (!title) {
				this.showDanger = true;
				return;
			}
			this.busy = true;
			// add a new thread on Firebase
			this.db
				.collection('forum')
				.add({
					title: title,
					created: new Date().getTime(),
					views: 0,
					participants: [this.firebaseUser.uid],
					description: '',
					cmntsCount: 1,
					lastUpdate: new Date().getTime(),
					hidden: false
				})
				.then(ref => {
					this.db
						.collection('forum')
						.doc(ref.id)
						.update({ slug: this.slugify(title, ref.id) })
						.then(res => {
							this.busy = false;
							this.closeModal();
							this.router.navigate(['/thread/' + this.slugify(title, ref.id)], { relativeTo: this.route });
							this.mixpanel.track('posted a new post', {});
						});
				});
		});
	};
}
