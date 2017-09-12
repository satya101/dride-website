import { Injectable } from '@angular/core';

declare var mixpanel: any;

interface UserInfo {
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
	providerId: string;
	uid: string;
}

@Injectable()
export class MixpanelService {


	constructor() { }


	track(name: string, data: any) {

		mixpanel.track(name, data);

	}

	createMixpanelProfile(user: UserInfo) {

		mixpanel.alias(user.uid);

		mixpanel.people.set({
			'$first_name': user.displayName,
			'$email': user.email
		});
	}


	logIn(uid: string) {

		mixpanel.identify(uid);

	}




}
