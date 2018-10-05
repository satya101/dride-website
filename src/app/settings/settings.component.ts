import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
import { PushNotificationsService } from '../push-notifications.service';

import { MetaService } from '../helpers/meta/meta.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	public firebaseUser: any;
	public email: string;
	public userDevices: any = {};
	public FCM: any = {};
	public userData: any = {
		name: '',
		anonymous: false,
		notification: {
			comments: false,
			subscribe: false
		}
	};
	public userDataObservable: Observable<any[]>;
	public userDevicesObservable: Observable<any[]>;

	constructor(
		private auth: AuthService,
		public db: AngularFirestore,
		public push: PushNotificationsService,
		private route: ActivatedRoute,
		private meta: MetaService
	) {
		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;
		});
	}

	async ngOnInit() {
		// if coming from unsubscribe
		await this.route.queryParams.subscribe(params => {
			if (params.unsubscribe) {
				alert(
					'You have been successfully unsubscribed from email communications. If you did this in error, login and update your preferences.'
				);
			}
		});

		this.meta.set('Settings', 'Manage your Dride account.');

		this.auth.verifyLoggedIn().then(res => {
			this.email = this.firebaseUser.email;

			this.db
				.collection('users')
				.doc(this.firebaseUser.uid)
				.valueChanges()
				.subscribe(snapshot => {
					this.userData = Object.assign(this.userData, snapshot);
				});

			// this.db
			// 	.object('/devices/' + this.firebaseUser.uid)
			// 	.valueChanges()
			// 	.subscribe(snapshot => {
			// 		this.userDevices = snapshot;
			// 	});

			// TODO: add Push calss
			this.push.setUid(this.firebaseUser.uid);
			this.push.getFCM().then(currentToken => {
				this.FCM = currentToken ? true : false;
			});
		});
	}
	resetPassword() {
		// $rootScope.auth.$sendPasswordResetEmail($scope.email).then(function () {
		// 	// Email sent.
		// 	// TODO: pretty message
		// 	console.log('ok')
		// }, function (error) {
		// 	// An error happened.
		// 	console.log(error)
		// });
	}
	saveNotificationOption(field, value) {
		this.db
			.collection('users')
			.doc(this.firebaseUser.uid)
			.update({ notification: { [field]: value } });
	}

	updateAnonymus(value) {
		this.db
			.collection('users')
			.doc(this.firebaseUser.uid)
			.update({ anonymous: value });
	}

	updateEmail() {
		// update email
		if (this.firebaseUser.email !== this.email) {
			this.firebaseUser.updateEmail(this.email).then(
				function() {
					// Update successful.
				},
				function(error) {
					// An error happened.
					alert(error.message);
				}
			);
		}
		// TODO: pretty message
		alert('Ok');
	}

	toggleNotifications() {
		this.push.havePush();
		if (this.FCM) {
			// disable push
			this.push.getPushToken();
		} else {
			// enable FCM
			this.push.revoke();
		}
	}
}
