import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { introAnim } from '../router.animations';

import { MixpanelService } from '../helpers/mixpanel.service';

import { MetaService } from '@ngx-meta/core';



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
		public user: UserService,
		private afAuth: AngularFireAuth,
		public mixpanel: MixpanelService,
		private readonly meta: MetaService) {

		afAuth.authState.subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});

	}

	ngOnInit() {

		this.sub = this.route.params.subscribe(params => {
			this.threadId = params['slug'].split('__').pop();

			this.db.object('/threads/' + this.threadId, { preserveSnapshot: true }).subscribe(snapshot => {
				if (!snapshot.val()) {
					this.router.navigate(['/page-not-found'])
				}else {
					// set meta tags
					this.meta.setTitle(snapshot.val().title);
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
			this.firebaseUser = this.user.getUser()
			this.db.list('conversations/' + this.threadId).push({
				'autherId': this.firebaseUser.uid,
				'auther': this.firebaseUser.displayName,
				'pic': this.firebaseUser.photoURL,
				'body': this.replyBox,
				'timestamp': (new Date).getTime()
			});

			this.replyBox = '';
			this.mixpanel.track('posted a comment', {});

		})




	}

	openLogin() {
		this.auth.openLogin();
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
