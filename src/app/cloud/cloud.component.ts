import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

import { AngularFirestore } from 'angularfire2/firestore';

import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';
import { SsrService } from '../helpers/ssr/ssr.service';

import { introAnim } from '../router.animations';
import { MetaService } from '../helpers/meta/meta.service';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-cloud',
	templateUrl: './cloud.component.html',
	styleUrls: ['./cloud.component.scss'],
	animations: [introAnim]
})
export class CloudComponent implements OnInit {
	@Input()
	isFull: any = true;
	hpClips: any;
	public firebaseUser: any;
	public replyBox: any = [];
	public isBrowser = false;
	public busy = true;
	public lastThreadCreated = 9000000000000;
	public clips = [];
	public limitToLast = 6;
	constructor(
		private db: AngularFirestore,
		private auth: AuthService,
		private http: HttpClient,
		public mixpanel: MixpanelService,
		public ssr: SsrService,
		private meta: MetaService
	) {
		this.isBrowser = ssr.isBrowser();
		// get Auth state
		this.auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;
		});
	}

	ngOnInit() {
		if (this.isFull) {
			this.meta.set('Dride Cloud', 'Best dashcam videos every day.');
		}
		// load first batch
		this.limitToLast = this.isFull ? 6 : 2;
		if (!this.isFull) {
			this.busy = false;
		}
		this.clips = [];
		this.lastThreadCreated = 9000000000000;
		this.getClips(this.limitToLast);
	}

	getClips(limitToLast: number) {
		this.db
			.collection('clips', ref =>
				ref
					.where('homepage', '==', true)
					.where('dateUploaded', '<', this.lastThreadCreated)
					.orderBy('dateUploaded', 'desc')
					.limit(limitToLast)
			)
			.snapshotChanges()
			.pipe(
				map(actions =>
					actions.map(a => {
						const data = a.payload.doc.data() as any;
						const videoId = a.payload.doc.id;
						return { videoId, ...data };
					})
				)
			)
			.subscribe(nodes => {
				this.clips = this.clips.concat(nodes);
				if (nodes.length) {
					this.lastThreadCreated = nodes[nodes.length - 1]['dateUploaded'];
				}
			});
	}

	onScroll() {
		this.limitToLast += 6;
		this.getClips(this.limitToLast);
	}

	fbShare = function(videoId) {
		if (!this.ssr.isBrowser()) {
			return;
		}

		window.open(
			encodeURI('https://www.facebook.com/sharer/sharer.php?u=https://dride.io/clip/' + videoId),
			'Facebook',
			'toolbar=0,status=0,resizable=yes,width=' +
				500 +
				',height=' +
				600 +
				',top=' +
				(window.innerHeight - 600) / 2 +
				',left=' +
				(window.innerWidth - 500) / 2
		);
	};

	twShare = function(videoId) {
		if (!this.ssr.isBrowser()) {
			return;
		}

		const url = 'https://dride.io/clip/' + videoId;
		const txt = encodeURIComponent('You need to see this! #dride ' + url);
		window.open(
			'https://www.twitter.com/intent/tweet?text=' + txt,
			'Twitter',
			'toolbar=0,status=0,resizable=yes,width=' +
				500 +
				',height=' +
				600 +
				',top=' +
				(window.innerHeight - 600) / 2 +
				',left=' +
				(window.innerWidth - 500) / 2
		);
	};

	isOwner(uid) {
		return uid && this.firebaseUser && uid === this.firebaseUser.uid;
	}

	removeClip = function(key, index) {
		if (!key) {
			console.error('Error: No Uid or videoId, Delete aborted');
			return;
		}
		// TODO: prompt before remove

		// firebase functions will take it from here..
		this.db
			.collection('clips')
			.doc(key)
			.update({ deleted: true });

		this.hpClips.items.splice(index, 1);
	};

	commentFoucs = function(id) {
		document.getElementById(id).focus();
	};

	loadMoreComments(op, videoId, index) {
		this.http.get(environment.firebase.databaseURL + '/conversations_video/' + op + '/' + videoId + '.json').subscribe(
			data => {
				const items = data;
				this.hpClips.items[index].comments = items;
				this.hpClips.items[index].loadMore = false;
			},
			error => {
				// TODO: log this
				console.error('An error occurred when requesting comments.');
			}
		);
	}

	sendComment = function(op, videoId, body, index) {
		if (!body) {
			alert('Please write something');
			return;
		}

		this.auth.verifyLoggedIn().then(res => {
			this.db
				.list('/conversations_video/' + op + '/' + videoId)
				.push({
					autherId: res.uid,
					auther: res.displayName,
					pic: res.photoURL,
					body: body,
					timestamp: new Date().getTime()
				})
				.then(() => {
					this.loadMoreComments(op, videoId, index);
					this.replyBox[index] = '';
				});

			this.mixpanel.track('posted a comment', {});
		});
	};
}
