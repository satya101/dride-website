import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';

import * as firebase from 'firebase/app';

import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import {
	AngularFireDatabase,
	FirebaseListObservable
} from 'angularfire2/database';

import { introAnim } from '../router.animations';

import { MixpanelService } from '../helpers/mixpanel.service';

@Component({
	selector: 'app-forum',
	templateUrl: './forum.component.html',
	styleUrls: ['./forum.component.scss'],
	animations: [ introAnim ]
})
export class ForumComponent implements OnInit {
	@Input() isFull = true;
	threads: any;

	constructor(
		private db: AngularFireDatabase,
		private modalService: BsModalService,
		public mixpanel: MixpanelService
	) { }

	ngOnInit() {

		const r = {
					query:
					{
						orderByChild: 'lastUpdate',
						orderByKey: true
					}
				}

		if (!this.isFull) {
			r.query['limitToLast'] = 4
		}

		this.threads = this.db
			.list('/threads', r)
			.map(arr => arr.reverse());
	}

	ask() {
		this.modalService.show(NgbdModalAskInForum);
	}
}

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

	constructor(
		public bsModalRef: BsModalRef,
		public db: AngularFireDatabase,
		private auth: AuthService,
		public user: UserService,
		private router: Router,
		private route: ActivatedRoute
	) { }

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
	// TODO: Add animation
	openThread = function (title) {
		this.auth.verifyLoggedIn().then(result => {
			if (!title) {
				this.showDanger = true;
				return;
			}

			this.firebaseUser = this.user.getUser();
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
