import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AuthService } from '../../auth.service';

import { AngularFireDatabase } from 'angularfire2/database';

import { introAnim } from '../../router.animations';

import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';

import { MetaService } from '../../helpers/meta/meta.service'
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications';


@Component({
	selector: 'app-thread',
	templateUrl: './thread.component.html',
	styleUrls: ['./thread.component.scss'],
	animations: [introAnim]
})
export class ThreadComponent implements OnInit, OnDestroy {

	currentThread: Observable<any[]>;
	conversation: Observable<any[]>;
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
		private notificationsService: NotificationsService,
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
			this.threadId = params['slug'].split('____').pop();

			// migrate to ___ in url
			if (this.threadId === params['slug']) {
				this.threadId = params['slug'].split('__').pop();
			}
			this.db.object<any>('/threads/' + this.threadId).valueChanges().subscribe(snapshot => {

				if (!snapshot) {
					this.router.navigate(['/page-not-found'])
				} else {
					// set meta tags
					this.meta.set(snapshot.title, snapshot.description, 'article');
				}
			});

			this.currentThread = this.db.object<any>('/threads/' + this.threadId).valueChanges();
			this.conversation = this.db.list('/conversations/' + this.threadId).valueChanges();

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
			this.getUserData(this.firebaseUser.uid).subscribe(
				(userData: any) => {
					if (this.replyBox) {
					this.db.list('conversations/' + this.threadId).push({
						'autherId': this.firebaseUser.uid,
						'auther': this.firebaseUser.displayName,
						'pic': userData.photoURL,
						'body': this.replyBox,
						'timestamp': (new Date).getTime(),
						'fid': this.getFid()
					});

					this.replyBox = '';
					this.mixpanel.track('posted a comment', {});
				}else {
					this.notificationsService.success('Oops..', 'Please write something to post..', {
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: true,
						clickToClose: true
					});
				}

				})
		})




	}

	getFid() {
		if (this.firebaseUser.providerData[0].providerId === 'facebook.com') {
			return this.firebaseUser.providerData[0].uid;
		} else {
			return null
		}
	}


	openLogin() {
		this.auth.openLogin();
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	// facebook profile pic expires after a period of time, We can save the pic as un-expired only for FB,
	// This should be refactored evantually..
	getProfilePic(node) {
		console.log(node)
		if (node.fid) {
			return 'https://graph.facebook.com/' + node.fid + '/picture';
		} else {
			return node.pic;
		}
	}
	getUserData(uid) {
		return this.db.object<any>('/userData/' + uid).valueChanges();
	}

}
