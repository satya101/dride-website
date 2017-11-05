import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AuthService } from '../../auth.service';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { introAnim } from '../../router.animations';

import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';

import { MetaService } from '../../helpers/meta/meta.service'


@Component({
	selector: 'app-thread',
	templateUrl: './thread.component.html',
	styleUrls: ['./thread.component.scss'],
	animations: [ introAnim ]
})
export class ThreadComponent implements OnInit, OnDestroy {

	currentThread: FirebaseObjectObservable<any[]>;
	conversation: FirebaseListObservable<any[]>;
	public threadId: string;
	public conversationPreviusIsMine: Array<boolean> = [];
	private sub: any;
	public replyBox: string;
	public firebaseUser: any;


	constructor(private route: ActivatedRoute,
		public db: AngularFireDatabase,
		private location: Location,
		private router: Router,
		private auth: AuthService,
		public mixpanel: MixpanelService,
		private meta: MetaService) {

		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});

	}

	ngOnInit() {
		// set meta tags
		this.meta.set('Thread on Dride Forum', '', 'article');

		this.sub = this.route.params.subscribe(params => {
			this.threadId = params['slug'].split('__').pop();

			this.db.object('/threads/' + this.threadId, { preserveSnapshot: true }).subscribe(snapshot => {
				if (!snapshot.val()) {
					this.router.navigate(['/page-not-found'])
				}else {
					// set meta tags
					this.meta.set(snapshot.val().title, snapshot.val().description, 'article');
				}
			});

			this.currentThread = this.db.object('/threads/' + this.threadId);
			this.conversation = this.db.list('/conversations/' + this.threadId);

			this.conversation.subscribe(snapshot => {
				this.sideThreadByAuther(snapshot, this.conversationPreviusIsMine)
			})


		});


	}


	sideThreadByAuther(threadData, conversationPreviusIsMine) {

		let previusKey = null;

		threadData.forEach(function (k, key) {

			if (!key) {
				previusKey = key;
				return;
			}
			// if same author posted again
			if (threadData[key].autherId === threadData[previusKey].autherId) {
				conversationPreviusIsMine[previusKey] = true;
			} else {
				conversationPreviusIsMine[previusKey] = false;
			}
			previusKey = key;
		});

	}

	/*
	*  Will push a new conversation object to DB (Add a comment in threadId)
	*/
	send() {

		this.auth.verifyLoggedIn().then(res => {
			this.db.list('conversations/' + this.threadId).push({
				'autherId': this.firebaseUser.uid,
				'auther': this.firebaseUser.displayName,
				'pic': this.firebaseUser.photoURL,
				'body': this.replyBox,
				'timestamp': (new Date).getTime(),
				'fid': this.getFid()
			});

			this.replyBox = '';
			this.mixpanel.track('posted a comment', {});

		})




	}

	getFid() {
		if (this.firebaseUser.providerData[0].providerId === 'facebook.com') {
			return this.firebaseUser.providerData[0].uid;
		}else {
			return null
		}
	}

	openLogin() {
		this.auth.openLogin();
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	getProfilePic(node) {
		if (node.fid) {
			return 'https://graph.facebook.com/' + node.fid + '/picture';
		}else {
			return node.pic;
		}
	}
}
