import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class UserService {

	firebaseUser;

	constructor(private afAuth: AngularFireAuth) {
		afAuth.authState.subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});
	}

	getUser() {
		return this.firebaseUser
	}

}
