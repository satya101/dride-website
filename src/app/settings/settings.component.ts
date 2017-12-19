import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { PushNotificationsService } from '../push-notifications.service';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { MetaService } from '../helpers/meta/meta.service'

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	public firebaseUser: any;
	public email: string;
	public userDevices: any = {}
	public FCM: any = {}
	public userData: any = {
		'name': '',
		'anonymous': false,
		'notification': {
			'comments': false,
			'subscribe': false
		}
	};
	public userDataObservable: FirebaseObjectObservable<any>;
	public userDevicesObservable: FirebaseObjectObservable<any>;

	constructor(private auth: AuthService,
				public db: AngularFireDatabase,
				public push: PushNotificationsService,
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

		this.meta.set(
			'Settings',
			'Manage your Dride account.'
		)

		this.auth.verifyLoggedIn().then(res => {
			this.email = this.firebaseUser.email;

			this.userDataObservable = this.db.object('/userData/' + this.firebaseUser.uid, { preserveSnapshot: true })
			this.userDataObservable.subscribe(snapshot => {
				this.userData = Object.assign(this.userData, snapshot.val())
			});

			this.userDevicesObservable = this.db.object('/devices/' + this.firebaseUser.uid, { preserveSnapshot: true })
			this.userDevicesObservable.subscribe(snapshot => {
				this.userDevices = snapshot.val()
			});

			// TODO: add Push calss
			this.push.setUid(this.firebaseUser.uid)
			this.push.getFCM().then( currentToken => {
				this.FCM = currentToken ? true : false
			})


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
	saveOption(field, value) {

		this.userDataObservable.update({ [field]: value })
	}

	updateEmail() {

		// update email
		if (this.firebaseUser.email !== this.email) {
			this.firebaseUser.updateEmail(this.email).then(function () {

				// Update successful.
			}, function (error) {
				// An error happened.
				alert(error.message)
			});
		}
		// TODO: pretty message
		alert('Ok')


	}

	toggleNotifications() {
		this.push.havePush()
		if (this.FCM) { // disable push
			this.push.getPushToken();
		}else { // enable FCM
			this.push.revoke();
		}
	}
}
