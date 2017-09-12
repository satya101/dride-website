import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { CloudPaginationService } from '../cloud/cloud-pagination.service';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { MixpanelService } from '../helpers/mixpanel.service';
import { VgAPI } from 'videogular2/core';


@Component({
	selector: 'app-cloud',
	templateUrl: './cloud.component.html',
	styleUrls: ['./cloud.component.scss']
})

export class CloudComponent implements OnInit {
	@Input() isFull = true;
	hpClips: any;
	public firebaseUser: any;
	public replyBox: any = [];

	constructor(private db: AngularFireDatabase,
		public af: AngularFireDatabase,
		private dCloud: CloudPaginationService,
		private auth: AuthService,
		private afAuth: AngularFireAuth,
		private http: HttpClient,
		public mixpanel: MixpanelService) {


		// get Auth state
		afAuth.authState.subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});


	}

	ngOnInit() {
		// load first batch
		this.dCloud.init(this.isFull);

		this.hpClips = this.dCloud

	}

	onPlayerReady(api: VgAPI, videoId: string) {
		api.getDefaultMedia().subscriptions.playing.subscribe(
			() => {
				this.mixpanel.track('playVideoOnHP', {vid: videoId})
			}
		);
	}

	fbShare = function (uid, videoId) {
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
