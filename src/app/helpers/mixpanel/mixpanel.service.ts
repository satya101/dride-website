import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SsrService } from '../../helpers/ssr/ssr.service';

// import mixpanel from 'mixpanel-browser/src/loader-module';
declare var mixpanel: any;

interface UserInfo {
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
	providerId: string;
	uid: string;
}

@Injectable({ providedIn: 'root' })
export class MixpanelService {
	constructor(public ssr: SsrService) {
		if (!this.ssr.isBrowser()) return;

		// initialize mixpanel client configured to communicate over https
		mixpanel.init(environment.mixpanel, {
			protocol: 'https'
		});
	}

	track(name: string, data: any) {
		if (!this.ssr.isBrowser()) return;

		mixpanel.track(name, data);
	}

	createMixpanelProfile(user: UserInfo) {
		if (!this.ssr.isBrowser()) return;

		mixpanel.alias(user.uid);

		mixpanel.people.set({
			$first_name: user.displayName,
			$email: user.email
		});
	}

	logIn(uid: string) {
		if (!this.ssr.isBrowser()) return;

		mixpanel.identify(uid);
	}
}
