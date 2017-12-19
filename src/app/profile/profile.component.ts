import { Component, Pipe, PipeTransform, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';
import { SsrService } from '../helpers/ssr/ssr.service'
import { MetaService } from '../helpers/meta/meta.service'
import { PlayerComponent } from '../layout/components/player/player.component'


import { introAnim } from '../router.animations';
import 'rxjs/add/operator/take';


@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	animations: [introAnim]
})
export class ProfileComponent implements OnInit {

	public map: any = { stroke: { 'color': '#6060FB', 'weight': 4 }, zoom: 16 }
	userHaveNoVideos = false;
	videoRoute: any = [];
	uid: string;
	videoId: string;
	public replyBox: string;
	clips: FirebaseListObservable<any>;
	orderedClips: any;
	currentVideoRef: FirebaseObjectObservable<any>;
	currentVideoRefLive: FirebaseObjectObservable<any>;
	currentVideo: any;
	conversationPreviusIsMine: any = [];
	comments: any = {};
	opData: any;
	public firebaseUser: any;
	public currentTime: number;

	constructor(private db: AngularFireDatabase,
		private route: ActivatedRoute,
		public http: HttpClient,
		private router: Router,
		private auth: AuthService,
		public mixpanel: MixpanelService,
		public ssr: SsrService,
		private meta: MetaService,
		private activatedRoute: ActivatedRoute
	) {

		// get Auth state
		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});

		this.currentTime = this.route.snapshot.queryParams['s'];
		this.route.params.subscribe(params => {

			this.userHaveNoVideos = false;
			this.videoRoute = [];
			this.uid = params['uid'];
			this.videoId = params['videoId'];

			if (typeof params['videoId'] === 'undefined') {
				const url =
					environment.firebase.databaseURL + '/clips/' +
					this.uid +
					'.json?limitToLast=1&orderBy="$key"';
				this.http
					.get(url)
					.subscribe(data => {
						if (data) {
							this.router.navigate(['/profile/' + this.uid + '/' + Object.keys(data)[0]]);
						} else {
							this.userHaveNoVideos = true
						}
					},
					error => {
						this.userHaveNoVideos = true;
						// TODO: log this
						console.error('An error occurred when requesting clips.');
					}
					)
			}

			if (params['uid']) {
				this.opData = db.object('userData/' + params['uid']);
			}

		});



	}

	ngOnInit() {

		if (!this.videoId || !this.uid) {
			return;
		}

		// subscribe to router event
		this.route.params.subscribe(params => {

			this.comments = null
			this.map.center = null;
			this.map.path = null;

			this.userHaveNoVideos = false;
			this.videoRoute = [];
			this.uid = params['uid'];
			this.videoId = params['videoId'];

			this.comments = {};

			this.clips = this.db.list('/clips/' + this.uid, { preserveSnapshot: true });

			this.clips.subscribe(snapshot => {
				this.orderedClips = this.orderClipsByDate(snapshot);
			});

			if (this.ssr.isBrowser()) {
				window.scrollTo(0, 0);
			}

			if (!this.ssr.isBrowser()) {
				this.setMetaTags(this.uid, this.videoId)
			}

			this.db.object('/clips/' + this.uid + '/' + this.videoId, { preserveSnapshot: true }).subscribe(currentVideoSanp => {
				const data = currentVideoSanp.val();

				if (!data || !data.dateUploaded) {
					this.router.navigate(['/profile/' + this.uid]);
					return;
				}

				this.currentVideo = data
				this.currentVideo['op'] = this.uid
				this.currentVideo['videoId'] = this.videoId

				this.meta.set(
					this.currentVideo ? this.currentVideo['description'] : '',
					this.currentVideo ? this.currentVideo['plates'] : ''
				)

				// concat old comments with new ones
				Object.assign(this.comments, data.comments)
				// load gps location
				if (!data.gps) {
					return;
				}

				this.http
					.get(data.gps.src)
					.subscribe(data => {
						if (!data) {
							return;
						}

						const s = this.prepGeoJsonToGoogleMaps(
							data
						);
						const middleRoad = Math.ceil(s.length / 2)
						if (s[middleRoad]) {
							this.map['center'] = { latitude: s[middleRoad].latitude, longitude: s[middleRoad].longitude };
							this.map['path'] = s;
						}

					},
					error => {
						this.userHaveNoVideos = true;
						// TODO: log this
						console.log('An error occurred when requesting clips.', error);
					}

					)

			})

		});

	}

	getNextViewCount(views) {
		return views ? +views + 1 : 1;
	}

	sideThreadByAuther = function (comments) {
		if (!comments) {
			return
		};

		let previusKey = null;
		// angular.forEach(comments, function(k, key) {
		for (const key in comments) {
			if (key) {

				if (!previusKey) {
					previusKey = key;
					return;
				}
				// if same author posted again
				if (
					comments[key].autherId === comments[previusKey].autherId
				) {
					this.conversationPreviusIsMine[previusKey] = true;
				} else {
					this.conversationPreviusIsMine[previusKey] = false;
				}
				previusKey = key;
			}
		};
	};

	orderClipsByDate(clips) {

		const clipsBydate = {};
		clips.forEach(value => {

			const key: any = value.key
			// TODO: remove fallback to Yi format
			const d = new Date((value.val().timestamp ? value.val().timestamp : this.yi_getTimeStamp(value.key)) * 1000);
			const iKey =
				d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();

			if (!clipsBydate[iKey]) {
				clipsBydate[iKey] = {};
			}

			if (value.val().thumbs && value.val().thumbs && value.val().thumbs.src) {
				clipsBydate[iKey][key] = value.val();
			}
		});

		// reverse

		const clipsBydateReversed = {};
		this.reverseForIn(clipsBydate, (key) => {
			clipsBydateReversed[key] = this.reverseObject(clipsBydate[key])
		});

		return clipsBydateReversed;
	};

	reverseForIn(obj, f) {
		const arr = [];
		for (const key in obj) {
			if (key) {
				// add hasOwnPropertyCheck if needed
				arr.push(key);
			}
		}
		for (let i = arr.length - 1; i >= 0; i--) {
			f.call(obj, arr[i]);
		}
	}

	reverseObject(obj) {
		const reverse = {};
		this.reverseForIn(obj, (key) => {
			reverse[key] = obj[key]
		});
		return reverse;
	}

	preatifyDate = function (date) {
		if (!date) {
			return '';
		}

		const exp = date.split('-');
		return new Date(exp[2], exp[1], exp[0], 0, 0, 0, 0).getTime();
	};


	hasComments = function (comments) {
		return comments && Object.keys(comments).length ? true : false;
	};

	hasMoreToLoad = function () {

		if (!this.comments || typeof this.comments === 'undefined') {
			return false;
		}


		return this.currentVideo &&
			this.currentVideo.cmntsCount >
			Object.keys(this.comments).length
			? true
			: false;
	};
	isOwner() {
		return this.firebaseUser && this.uid === this.firebaseUser.uid
	}

	commentFoucs = function () {
		document.getElementById('replyBox').focus();
	}
	sendComment = function () {
		if (!this.replyBox) {
			alert('Please write something');
			return;
		}

		this.auth.verifyLoggedIn().then(res => {
			this.db.list('/conversations_video/' + this.uid + '/' + this.videoId)
				.push({
					autherId: res.uid,
					auther: res.displayName,
					pic: res.photoURL,
					body: this.replyBox,
					timestamp: new Date().getTime()
				})
				.then(res => {
					this.loadMoreComments(this.videoId);
					this.replyBox = '';
				});
			this.mixpanel.track('posted a comment', {});
		})
	};

	// TODO: infinite scroll would be nice
	loadMoreComments = function () {


		this.http
			.get(environment.firebase.databaseURL + '/conversations_video/' + this.uid + '/' + this.videoId + '.json')
			.subscribe(data => {
				const items = data;
				this.comments = items;

				this.conversationPreviusIsMine = [];
				this.sideThreadByAuther(this.comments);

			},
			error => {
				// TODO: log this
				console.log('An error occurred when requesting comments.');
			}

			)


	};

	fbShare = function () {
		if (!this.ssr.isBrowser()) { return }

		window.open(
			'https://www.facebook.com/sharer/sharer.php?u=https://dride.io/profile/' +
			this.uid +
			'/' +
			this.videoId,
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
	twShare = function () {
		if (!this.ssr.isBrowser()) { return }

		const url = 'https://dride.io/profile/' + this.uid + '/' + this.videoId;
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
	removeClip = function () {

		if (!this.uid || !this.videoId) {
			console.error('Error: No Uid or videoId, Delete aborted')
			return;
		}
		// TODO: prompt before remove

		// firebase functions will take it from here..
		this.db.object('/clips/' + this.uid + '/' + this.videoId).update({ 'deleted': true })


		this.router.navigate(['/profile/' + this.uid]);

	};

	prepGeoJsonToGoogleMaps = function (geoJson) {

		const videoRoute = [];
		Object.keys(geoJson).forEach(function (key) {
			geoJson[key] = geoJson[key];

			videoRoute.push({
				latitude: parseFloat(geoJson[key].latitude),
				longitude: parseFloat(geoJson[key].longitude)
			});


		});

		return videoRoute;
	};


	setMetaTags(uid, videoId) {
		const url = environment.firebase.databaseURL +
			'/clips/' + uid + '/' + videoId + '.json'
		this.http
			.get(url)
			.subscribe(data => {
				this.meta.addTag({property: 'og:title', content: data['description'] ? data['description'] : 'Event on Dride Cloud'});
				this.meta.addTag({property: 'og:description', content: data['plates'] ? data['plates'] : 'This video doesn\'t have a description yet.'});
				this.meta.addTag({property: 'og:image:width', content: '320'});
				this.meta.addTag({property: 'og:image:height', content: '176'});
				this.meta.addTag({property: 'og:image', content: data['thumbs']['src']});
				this.meta.addTag({property: 'og:video', content: data['clips']['src']});
				this.meta.addTag({property: 'og:video:secure_url', content: data['clips']['src']});
				this.meta.addTag({property: 'og:type', content: 'video.other'});
				this.meta.addTag({property: 'twitter:card', content: 'player'});
				this.meta.addTag({property: 'twitter:site', content: '@drideHQ'});
				this.meta.addTag({property: 'twitter:url', content: 'https://dride.io/profile/' + uid + '/' + videoId});
				this.meta.addTag({property: 'twitter:title', content: data['description']});
				this.meta.addTag({property: 'twitter:description', content: data['plates']});
				this.meta.addTag({property: 'twitter:image:src', content: data['thumbs']['src']});
				this.meta.addTag({property: 'twitter:player', content: data['clips']['src']});
				this.meta.addTag({property: 'twitter:player:width', content: '1280'});
				this.meta.addTag({property: 'twitter:player:height', content: '720'});
				this.meta.addTag({property: 'twitter:player:stream', content: data['clips']['src']});
				this.meta.addTag({property: 'twitter:player:stream:content_type', content: 'video/mp4'});
			})
	}

	/*
	*	Will split the time from Yi dash cam and make it a timestamp
	*/
	yi_getTimeStamp(videoId) {

		const date = videoId.split('_');

		if (!date[1]) {
			return videoId;
		}

		const year = date[0];
		const month = date[1][0] + date[1][1]
		const day = date[1][2] + date[1][3]
		const hour = date[2][0] + date[2][1]
		const minute = date[2][2] + date[2][3]
		const sec = date[2][4] + date[2][5]

		return new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec).getTime() / 1000
	}




}
