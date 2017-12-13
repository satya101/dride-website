import { Injectable, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import * as firebase from 'firebase/app';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MixpanelService } from './helpers/mixpanel/mixpanel.service';


@Injectable()
export class AuthService {

	closeResult: string;

	constructor(
		private modalService: BsModalService,
		public afAuth: AngularFireAuth,
		public mixpanel: MixpanelService) { }

	openLogin() {

		return this.modalService.show(NgbdModalLogin);

	}


	logOut() {

		this.afAuth.auth.signOut().then(function () {
			// Sign-out successful.
		}, function (error) {
			// An error happened.
		});


	};

	verifyLoggedIn() {
		return new Promise((resolve: any, reject) => {

			this.afAuth.authState.subscribe(user => {
				if (!user) {
					return this.openLogin()
				}
				// log user to mixpanel
				this.mixpanel.logIn(user.uid)
				console.log(user)
				resolve(user)

			});


		});
	}

	getState(): Observable<any> {
		return this.afAuth.authState;
	}


}




@Component({
	selector: 'ngbd-modal-content',
	templateUrl: './layout/templates/modal/login/modal.html',
	styleUrls: ['./layout/templates/modal/login/modal.scss']
})
export class NgbdModalLogin {
	@Input() name;

	isLoaded = false;
	onWelcome = false;
	anonymous = false;
	public loginError: string;
	userData: FirebaseListObservable<any[]>;
	user: Observable<firebase.User>;

	constructor(public activeModal: BsModalRef,
				public afAuth: AngularFireAuth,
				public db: AngularFireDatabase,
				public mixpanel: MixpanelService) {
		this.user = afAuth.authState;
	}

	closeModal = function () {
		this.activeModal.hide();
	};


	dismissModal = function () {
		this.activeModal.hide();
	};

	connectWithFacebook = function () {

		this.connectWithProvider(new firebase.auth.FacebookAuthProvider())

	};

	connectWithGoogle = function () {

		this.connectWithProvider(new firebase.auth.GoogleAuthProvider())

	};

	connectWithProvider = function (provider: any) {

		// login with Facebook
		this.afAuth.auth.signInWithPopup(provider)
			.catch(error => {
				this.loginError = error.message;
				console.log('Authentication failed:', error);
				// TODO: Show friendly message and log
			});

		this.afAuth.authState.subscribe(user => {

			if (!user) {
				return;
			}

			this.mixpanel.track('successful login', provider);

			// ensure push token
			// TODO: //pushNotification.getPushToken(res.uid)

			this.db.object('/userData/' + user.uid).subscribe(data => {
				if (data.showedAnonymous === true) {
					this.closeModal();
				} else {

					// first time logged in
					this.mixpanel.createMixpanelProfile(user)

					this.onWelcome = true;
					firebase.database().ref('userData').child(user.uid).update({ showedAnonymous: true });
				}

			});



		})


	};



}



