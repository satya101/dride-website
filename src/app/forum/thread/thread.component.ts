import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../auth.service';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { introAnim } from '../../router.animations';

import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';

import { MetaService } from '../../helpers/meta/meta.service';
import { Observable } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { Md5 } from 'ts-md5/dist/md5';
import { SsrService } from '../../helpers/ssr/ssr.service';

@Component({
	selector: 'app-thread',
	templateUrl: './thread.component.html',
	styleUrls: ['./thread.component.scss'],
	animations: [introAnim]
})
export class ThreadComponent implements OnInit, OnDestroy {
	currentThread: Observable<any>;
	conversation: Observable<any[]>;
	public threadId: string;
	public conversationPreviusIsMine: Array<boolean> = [];
	public _routeListener: any;
	public replyBox: string;
	public firebaseUser: any;
	public profilePic: string;

	uploadPercent = 0;

	constructor(
		private route: ActivatedRoute,
		public db: AngularFirestore,
		public rtdb: AngularFireDatabase,
		private router: Router,
		private auth: AuthService,
		public mixpanel: MixpanelService,
		private notificationsService: NotificationsService,
		private meta: MetaService,
		private storage: AngularFireStorage,
		public ssr: SsrService
	) {
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
		this._routeListener = this.route.params.subscribe(params => {
			this.threadId = params['slug'].split('____').pop();
			// migrate to ___ in url
			if (this.threadId === params['slug']) {
				this.threadId = params['slug'].split('__').pop();
			}
			this.currentThread = this.db
				.collection('forum')
				.doc(this.threadId)
				.valueChanges();
			this.currentThread.subscribe((snapshot: any) => {
				if (!snapshot) {
					this.router.navigate(['/page-not-found']);
				} else {
					// set meta tags
					this.meta.set(snapshot.title, snapshot.description, 'article');
				}
			});
			this.conversation = this.db
				.collection('forum')
				.doc(this.threadId)
				.collection('conversations', ref => ref.orderBy('timestamp', 'asc'))
				.valueChanges();
			this.conversation.subscribe(snapshot => {
				this.sideThreadByAuther(snapshot, this.conversationPreviusIsMine);
			});
		});
	}

	ngOnDestroy() {
		try {
			this._routeListener.unsubscribe();
		} catch (e) {
			console.warn('no route to unsub..');
		}
	}

	sideThreadByAuther(threadData, conversationPreviusIsMine) {
		let previusKey = null;

		threadData.forEach(function(k, key) {
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
			this.getUserData(this.firebaseUser.uid).subscribe((userData: any) => {
				if (this.replyBox) {
					this.db
						.collection('forum')
						.doc(this.threadId)
						.collection('conversations')
						.add({
							autherId: this.firebaseUser.uid,
							auther: this.firebaseUser.displayName,
							pic: userData.photoURL,
							body: this.replyBox,
							timestamp: new Date().getTime(),
							fid: this.getFid()
						});
					this.replyBox = '';
					this.mixpanel.track('posted a comment', {});
				} else {
					this.notificationsService.success('Oops..', 'Please write something to post..', {
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: true,
						clickToClose: true
					});
				}
			});
		});
	}

	getFid() {
		if (this.firebaseUser.providerData[0].providerId === 'facebook.com') {
			return this.firebaseUser.providerData[0].uid;
		} else {
			return null;
		}
	}

	openLogin() {
		this.auth.openLogin();
	}

	getUserData(uid) {
		return this.rtdb.object<any>('/userData/' + uid).valueChanges();
	}

	uploadFile(event) {
		const file = event.target.files[0];
		const fileType = file.name.split('.').pop();
		const filePath = 'forum/' + this.firebaseUser.uid + '/' + Md5.hashStr(file.name) + '.' + fileType;
		const fileRef = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);

		// observe percentage changes
		task.percentageChanges().subscribe(percent => {
			this.uploadPercent = percent;
			if (percent === 100) {
				setTimeout(() => {
					this.uploadPercent = 0;
				}, 2500);
			}
		});
		// get notified when the download URL is available
		task
			.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe(url => {
						if (!this.replyBox) {
							this.replyBox = '';
						}
						this.replyBox = this.replyBox.concat('\n![image](', url.toString(), ')');
					});
				})
			)
			.subscribe();
	}
}
