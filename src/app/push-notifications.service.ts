import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app'; // for typings
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class PushNotificationsService {

	public messaging;
	public uid;
	public FCM;
	public currentToken;
	constructor(public firebaseApp: FirebaseApp) { }



	setPushObject() {
		this.messaging = this.firebaseApp.messaging();
	}
	setUid(uid) {
		this.uid = uid;
	}
	getFCM() {
		return new Promise((resolve: any, reject) => {
			this.setPushObject();
			this.messaging.getToken().then((currentToken) => {

				firebase.database().ref('pushTokens/' + this.uid).once('value', (snapshot) => {
					resolve(snapshot.val() ? snapshot.val().value : null)
				});

			}).catch(() => {
				reject();
			});
		});
	}

	getPushToken() {
		if ('Notification' in window) {
			this.setPushObject();

			this.messaging.requestPermission()
				.then(() => {
					console.log('Notification permission granted.');
					this.getToken()

				})
				.catch((err) => {
					console.log(err);
					console.log('Unable to get permission to notify.', err);
				});
		}

	}
	revoke() {
		this.firebaseApp.database().ref('pushTokens/' + this.uid).remove();
	}
	onPushRecieved() {

		this.setPushObject();

		this.messaging.onMessage(function (payload) {
			// TODO: add internal messaging
			console.log('Message received. ', payload);
			// ...
		});



	}
	havePush() {
		this.FCM = false;

		if (!this.messaging) {
			this.setPushObject()
		}

		this.messaging.requestPermission()
			.then(() => {
				this.FCM = true;

			})
			.catch((err) => {
				this.FCM = false;
			});

	}
	getToken() {


		// Get Instance ID token. Initially this makes a network call, once retrieved
		// subsequent calls to getToken will return from cache.
		this.messaging.getToken()
			.then((currentToken) => {
				if (currentToken) {
					// update DB with user token
					this.firebaseApp.database().ref('pushTokens/' + this.uid).set({
						value: currentToken
					});

				} else {
					// Show permission request.
					console.log('No Instance ID token available. Request permission to generate one.');

				}
			})
			.catch((err) => {
				console.log('An error occurred while retrieving token. ', err);
			});
	}




}
