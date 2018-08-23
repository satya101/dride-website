import { Component, Pipe, PipeTransform, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

import { AngularFireDatabase } from 'angularfire2/database';
import { MixpanelService } from '../helpers/mixpanel/mixpanel.service';
import { SsrService } from '../helpers/ssr/ssr.service';
import { MetaService } from '../helpers/meta/meta.service';

import { introAnim } from '../router.animations';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	animations: [introAnim]
})
export class ProfileComponent implements OnInit {
	public map: any = { stroke: { color: '#6060FB', weight: 4 }, zoom: 16 };
	userHaveNoVideos = false;
	videoRoute: any = [];
	uid: string;
	videoId: string;
	public replyBox: string;
	clips: Observable<any[]>;
	orderedClips: any;
	currentVideoRef: Observable<any[]>;
	currentVideoRefLive: Observable<any[]>;
	currentVideo: any;
	conversationPreviusIsMine: any = [];
	comments: any = {};
	opData: any;
	public firebaseUser: any;
	public currentTime: number;
	public video404 = false;

	constructor(
		private rtdb: AngularFireDatabase,
		private db: AngularFirestore,
		private route: ActivatedRoute,
		public http: HttpClient,
		private router: Router,
		private auth: AuthService,
		public mixpanel: MixpanelService,
		public ssr: SsrService,
		private meta: MetaService
	) {
		// get Auth state
		this.auth.getState().subscribe(user => {
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

			// redirect old format videos to new format
			if (this.videoId && this.uid) {
				this.redirectIfOldFormat();
				return;
			}

			if (typeof this.videoId === 'undefined') {
				this.db
					.collection('clips', ref =>
						ref
							.where('uid', '==', this.uid)
							.orderBy('dateUploaded', 'desc')
							.limit(1)
					)
					.snapshotChanges()
					.pipe(
						map(actions =>
							actions.map(a => {
								const data = a.payload.doc.data() as any;
								const key = a.payload.doc.id;
								return { key, ...data };
							})
						)
					)
					.subscribe(
						(data: any) => {
							if (data[0]) {
								this.router.navigate(['/clip/' + data[0].key]);
							} else {
								this.userHaveNoVideos = true;
							}
						},
						error => {
							this.userHaveNoVideos = true;
							// TODO: log this
							console.error('An error occurred when requesting clips.');
						}
					);
			}
		});
	}

	ngOnInit() {
		if (!this.videoId && !this.uid) {
			return;
		}

		// subscribe to router event
		this.route.params.subscribe(params => {
			this.comments = [];
			this.map.center = null;
			this.map.path = null;

			this.userHaveNoVideos = false;
			this.videoRoute = [];
			this.uid = params['uid'];
			this.videoId = params['videoId'];

			if (this.uid) {
				this.loadUserDetails();
			}

			if (this.ssr.isBrowser()) {
				window.scrollTo(0, 0);
			}

			if (!this.ssr.isBrowser()) {
				this.setMetaTags(this.videoId);
			}
			if (this.videoId) {
				this.loadComments();
				const subj = this.db
					.collection('clips')
					.doc(this.videoId)
					.valueChanges()
					.subscribe((currentVideoSanp: any) => {
						const data = currentVideoSanp;

						if (!data || !data.dateUploaded) {
							this.video404 = true;
							return;
						}
						this.currentVideo = data;
						this.currentVideo['op'] = this.uid;
						this.currentVideo['videoId'] = this.videoId;
						this.uid = data.uid;
						this.loadUserDetails();

						this.meta.set(
							this.currentVideo ? this.currentVideo['description'] : '',
							this.currentVideo ? this.currentVideo['plates'] : ''
						);

						// load gps location
						if (!data.gps) {
							return;
						}

						this.http.get(data.gps.src).subscribe(
							gpsData => {
								if (!gpsData) {
									return;
								}

								const s = this.prepGeoJsonToGoogleMaps(gpsData);
								const middleRoad = Math.ceil(s.length / 2);
								if (s[middleRoad]) {
									this.map['center'] = { latitude: s[middleRoad].latitude, longitude: s[middleRoad].longitude };
									this.map['path'] = s;
								}
							},
							error => {
								// TODO: log this
								console.log('An error occurred when requesting clips.', error);
							}
						);
						subj.unsubscribe();
					});
			}
		});
	}
	loadComments() {
		this.db
			.collection('clipsComments', ref => ref.where('videoId', '==', this.videoId))
			.snapshotChanges()
			.pipe(
				map(actions =>
					actions.map(a => {
						const data = a.payload.doc.data() as any;
						const key = a.payload.doc.id;
						return { key, ...data };
					})
				)
			)
			.subscribe(comments => {
				this.comments = comments;
			});
	}

	loadUserDetails() {
		this.opData = this.rtdb.object('userData/' + this.uid).valueChanges();
		this.db
			.collection('clips', ref => ref.where('uid', '==', this.uid))
			.snapshotChanges()
			.pipe(
				map(actions =>
					actions.map(a => {
						const data = a.payload.doc.data() as any;
						const key = a.payload.doc.id;
						return { key, ...data };
					})
				)
			)
			.subscribe(snapshot => {
				this.orderedClips = this.orderClipsByDate(snapshot);
			});
	}

	orderClipsByDate(clips) {
		const clipsBydate = {};
		let value;
		for (let i = 0; i < clips.length; i++) {
			value = clips[i];

			if (clips[i].key.indexOf('_s') !== -1) {
				clips[i].key = clips[i].key.replace('_s', '');
			}

			const key: any = value.key;
			// TODO: remove fallback to Yi format
			const d = new Date(this.normalizeTimeStamp(value.timestamp, value.key));

			const iKey = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();

			if (value && value.thumbs && value.thumbs && value.thumbs.src) {
				if (!clipsBydate[iKey]) {
					clipsBydate[iKey] = {};
				}
				clipsBydate[iKey][key] = value;
			}
		}
		// reverse

		const clipsBydateReversed = {};
		this.reverseForIn(clipsBydate, key => {
			clipsBydateReversed[key] = this.reverseObject(clipsBydate[key]);
		});

		return clipsBydateReversed;
	}

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
		this.reverseForIn(obj, key => {
			reverse[key] = obj[key];
		});
		return reverse;
	}

	preatifyDate = function(date) {
		if (!date) {
			return '';
		}

		const exp = date.split('-');
		return new Date(exp[2], exp[1], exp[0], 0, 0, 0, 0).getTime();
	};

	hasComments = function(comments) {
		return comments && Object.keys(comments).length ? true : false;
	};

	hasMoreToLoad = function() {
		if (!this.comments || typeof this.comments === 'undefined') {
			return false;
		}

		return this.currentVideo && this.currentVideo.cmntsCount > Object.keys(this.comments).length ? true : false;
	};
	isOwner() {
		return this.firebaseUser && this.uid === this.firebaseUser.uid;
	}

	commentFoucs = function() {
		document.getElementById('replyBox').focus();
	};
	sendComment = function() {
		if (!this.replyBox) {
			alert('Please write something');
			return;
		}

		this.auth.verifyLoggedIn().then(res => {
			this.db
				.collection('clipsComments')
				.add({
					autherId: res.uid,
					auther: res.displayName,
					pic: res.photoURL,
					body: this.replyBox,
					timestamp: new Date().getTime(),
					videoId: this.videoId
				})
				.then(() => {
					this.replyBox = '';
				});
			this.mixpanel.track('posted a comment', {});
		});
	};

	fbShare = function() {
		if (!this.ssr.isBrowser()) {
			return;
		}

		window.open(
			'https://www.facebook.com/sharer/sharer.php?u=https://dride.io/clip/' + this.videoId,
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
	twShare = function() {
		if (!this.ssr.isBrowser()) {
			return;
		}

		const url = 'https://dride.io/clip/' + this.videoId;
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
	removeClip = function() {
		if (!this.uid || !this.videoId) {
			console.error('Error: No Uid or videoId, Delete aborted');
			return;
		}
		// TODO: prompt before remove

		// firebase functions will take it from here..
		this.db
			.collection('clips')
			.doc(this.videoId)
			.update({ deleted: true });

		this.router.navigate(['/profile/' + this.uid]);
	};

	prepGeoJsonToGoogleMaps = function(geoJson) {
		const videoRoute = [];
		Object.keys(geoJson).forEach(function(key) {
			videoRoute.push({
				latitude: parseFloat(geoJson[key].latitude),
				longitude: parseFloat(geoJson[key].longitude)
			});
		});

		return videoRoute;
	};

	setMetaTags(videoId) {
		this.db
			.collection('clips')
			.doc(videoId)
			.valueChanges()
			.subscribe(data => {
				this.meta.addTag({
					property: 'og:title',
					content: data['description'] ? data['description'] : 'Event on Dride Cloud'
				});
				this.meta.addTag({
					property: 'og:description',
					content: data['plates'] ? data['plates'] : 'This video doesn\'t have a description yet.'
				});
				this.meta.addTag({ property: 'og:image:width', content: '320' });
				this.meta.addTag({ property: 'og:image:height', content: '176' });
				this.meta.addTag({ property: 'og:image', content: data['thumbs']['src'] });
				this.meta.addTag({ property: 'og:video', content: data['clips']['src'] });
				this.meta.addTag({ property: 'og:video:secure_url', content: data['clips']['src'] });
				this.meta.addTag({ property: 'og:type', content: 'video.other' });
				this.meta.addTag({ property: 'twitter:card', content: 'player' });
				this.meta.addTag({ property: 'twitter:site', content: '@drideHQ' });
				this.meta.addTag({ property: 'twitter:url', content: 'https://dride.io/clip/' + videoId });
				this.meta.addTag({ property: 'twitter:title', content: data['description'] });
				this.meta.addTag({ property: 'twitter:description', content: data['plates'] });
				this.meta.addTag({ property: 'twitter:image:src', content: data['thumbs']['src'] });
				this.meta.addTag({ property: 'twitter:player', content: data['clips']['src'] });
				this.meta.addTag({ property: 'twitter:player:width', content: '1280' });
				this.meta.addTag({ property: 'twitter:player:height', content: '720' });
				this.meta.addTag({ property: 'twitter:player:stream', content: data['clips']['src'] });
				this.meta.addTag({ property: 'twitter:player:stream:content_type', content: 'video/mp4' });
			});
	}

	normalizeTimeStamp(timestamp, key = null) {
		if (timestamp) {
			if (timestamp.toString().length === 10) {
				timestamp = timestamp + '000';
			}
			timestamp = parseInt(timestamp, 10);
		}
		if (!isNaN(timestamp) && new Date(timestamp).getTime() > 0) {
			return timestamp;
		} else {
			return key ? this.yi_getTimeStamp(key) : timestamp;
		}
	}
	/*
	*	Will split the time from Yi dash cam and make it a timestamp
	*/
	yi_getTimeStamp(videoId) {
		const date = videoId.split('_');

		if (!date[1]) {
			return videoId;
		}

		let year = date[0];
		let month = date[1][0] + date[1][1];
		let day = date[1][2] + date[1][3];
		let hour = date[2][0] + date[2][1];
		let minute = date[2][2] + date[2][3];
		let sec = date[2][4] + date[2][5];

		// Yi have a new format: YYYY_mm_dd_hhmmss if we dont have a vaild date try again
		if (!new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec).getTime()) {
			year = date[0];
			month = date[1][0] + date[1][1];
			day = date[2][0] + date[2][1];
			hour = date[3][0] + date[3][1];
			minute = date[3][2] + date[3][3];
			sec = date[3][4] + date[3][5];
			return new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec).getTime();
		} else {
			return new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec).getTime();
		}
	}

	/**
	 * @description will redirect old format /profile/:uid/:videoId to /clip/:id
	 */
	private redirectIfOldFormat() {
		const sub = this.db
			.collection('clips', ref =>
				ref
					.where('uid', '==', this.uid)
					.where('id', '==', this.videoId)
					.limit(1)
			)
			.snapshotChanges()
			.pipe(
				map(actions =>
					actions.map(a => {
						const data = a.payload.doc.data() as any;
						const key = a.payload.doc.id;
						return { key, ...data };
					})
				)
			)
			.subscribe(clip => {
				sub.unsubscribe();
				this.router.navigate(['/clip/' + clip[0].key]);
			});
	}
}
