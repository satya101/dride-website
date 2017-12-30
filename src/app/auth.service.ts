import { Injectable, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import * as firebase from 'firebase/app';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MixpanelService } from './helpers/mixpanel/mixpanel.service';
import { NotificationsService } from 'angular2-notifications';


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
	isFlipped = false;
	public loginError: string;
	public r: {email: string, name: string, password: string};
	public l: {email: string, password: string};


	userData: FirebaseListObservable<any[]>;
	user: Observable<firebase.User>;

	constructor(public activeModal: BsModalRef,
				public afAuth: AngularFireAuth,
				public db: AngularFireDatabase,
				private notificationsService: NotificationsService,
				public mixpanel: MixpanelService) {
		this.user = afAuth.authState;
		this.r = {email: '', password: '', name: ''}
		this.l = {email: '', password: ''}
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


	signInWithEmail() {
		return new Promise((resolve, reject) => {
			console.log(this.r)
			console.log(this.l)
			firebase.auth().signInWithEmailAndPassword(this.r.email, this.r.password)
				.then(() => {
					this.closeModal();
					resolve(true);
				})
				.catch((error: firebase.FirebaseError) => {
					console.error('error' , error)
					this.notificationsService.success('Oops..', error.message, {
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: true,
						clickToClose: true
					});
					reject(error);


				});
		})
	}

	signUpWithEmail() {
		return new Promise((resolve, reject) => {
			firebase.auth().createUserWithEmailAndPassword(this.r.email, this.r.password)
				.then(() => {
					firebase.auth().currentUser.updateProfile({
						displayName: this.r.name,
						photoURL: 'https://storage.cloud.google.com/dride-2384f.appspot.com/assets/profilePic/pic' + this.randProfilePic() + '.png'
					}).then(() => {
						this.closeModal();
						this.sendVerificationEmail();
						resolve(true);
					}).catch(function (error) {
						// An error happened.
						console.error('error' , error)
						this.notificationsService.success('Oops..', error.message, {
							timeOut: 3000,
							showProgressBar: true,
							pauseOnHover: true,
							clickToClose: true
						});
						reject(error);
					});


				})
				.catch((error: firebase.FirebaseError) => {
					console.error('error' , error)
					this.notificationsService.success('Oops..', error.message, {
						timeOut: 3000,
						showProgressBar: true,
						pauseOnHover: true,
						clickToClose: true
					});
					reject(error);

				});
		})
	}
	sendVerificationEmail() {
		return new Promise((resolve, reject) => {
			firebase.auth().currentUser
				.sendEmailVerification()
				.then(() => {
					resolve(false);
				})
				.catch(function (error) {
					console.error(error)
					reject(error)
				});
		});

	}

	private randProfilePic() {
		return Math.floor(Math.random() * (5 - 1) + 1)
	}
}



