import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { CloudPaginationService } from '../cloud/cloud-pagination.service';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';
import { SsrService } from '../helpers/ssr/ssr.service'

import { introAnim } from '../router.animations';
import { MetaService } from '../helpers/meta/meta.service'


@Component({
	selector: 'app-cloud',
	templateUrl: './cloud.component.html',
	styleUrls: ['./cloud.component.scss'],
	animations: [introAnim]
})

export class CloudComponent implements OnInit {
	@Input() isFull: any = true;
	hpClips: any;
	public firebaseUser: any;
	public replyBox: any = [];
	public isBrowser = false;

	constructor(private db: AngularFireDatabase,
		public af: AngularFireDatabase,
		private dCloud: CloudPaginationService,
		private auth: AuthService,
		private http: HttpClient,
		public mixpanel: MixpanelService,
		public ssr: SsrService,
		private meta: MetaService) {


		this.isBrowser = ssr.isBrowser()
		// get Auth state
		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});


	}

	ngOnInit() {

		if (this.isFull) {
			this.meta.set(
				'Dride Cloud',
				'Best dashcam videos every day.'
			)
		}
		// load first batch
		this.dCloud.init(this.isFull);
		this.hpClips = this.dCloud
	}


	fbShare = function (uid, videoId) {
		if (!this.ssr.isBrowser()) { return }

			window.open(
				'https://www.facebook.com/sharer/sharer.php?u=https://dride.io/profile/' +
				uid +
				'/' +
				videoId,
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

	twShare = function (uid, videoId) {
		if (!this.ssr.isBrowser()) { return }

		const url = 'https://dride.io/profile/' + uid + '/' + videoId;
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
		return uid && this.firebaseUser && uid === this.firebaseUser.uid
	}


	removeClip = function (op, vId, index) {

		if (!op || !vId) {
			console.error('Error: No Uid or videoId, Delete aborted')
			return;
		}
		// TODO: prompt before remove

		// firebase functions will take it from here..
		this.db.object('/clips/' + op + '/' + vId).update({ 'deleted': true })


		this.hpClips.items.splice(index, 1)

	};

	commentFoucs = function (id) {
		document.getElementById(id).focus();
	}

	loadMoreComments(op, videoId, index) {

		this.http
			.get(environment.firebase.databaseURL + '/conversations_video/' + op + '/' + videoId + '.json')
			.subscribe(data => {
				const items = data;
				this.hpClips.items[index].comments = items;
				this.hpClips.items[index].loadMore = false;
			},
			error => {
				// TODO: log this
				console.log('An error occurred when requesting comments.');
			}

			)


	};

	sendComment = function (op, videoId, body, index) {
		if (!body) {
			alert('Please write something');
			return;
		}

		this.auth.verifyLoggedIn().then(res => {
			this.db.list('/conversations_video/' + op + '/' + videoId)
				.push({
					autherId: res.uid,
					auther: res.displayName,
					pic: res.photoURL,
					body: body,
					timestamp: new Date().getTime()
				})
				.then(res => {
					this.loadMoreComments(op, videoId, index);
					this.replyBox[index] = '';
				});

			this.mixpanel.track('posted a comment', {});
		})


	};



}
