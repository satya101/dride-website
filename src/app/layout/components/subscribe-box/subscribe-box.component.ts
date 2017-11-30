import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MixpanelService } from '../../../helpers/mixpanel/mixpanel.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from 'angular2-notifications';

@Component({
	selector: 'app-subscribe-box',
	templateUrl: './subscribe-box.component.html',
	styles: ['h3{ text-align: center; color: #7d7d7d; text-transform: none; }',
		'.subscribe{padding-bottom: 50px; padding-top: 50px; border: 1px solid rgba(0,0,0,.09); box-shadow: 0 1px 4px 0 rgba(0,0,0,.04); width: 99%; background-color: #f5f5f5;}',
		'.row{margin-top: 31px;}']
})
export class SubscribeBoxComponent implements OnInit {

	public email: string;
	public show = true;
	constructor(private http: HttpClient,
		private mixpanel: MixpanelService,
		private cookieService: CookieService,
		private notificationsService: NotificationsService) {
	}

	ngOnInit() {
		this.show = this.cookieService.get('subscribed') ? false : true
	}

	sendDetails = function (email) {

		// subscribe users

		const url = environment.functionsURL + '/subscriber?email=' + email;
		this.http.get(url).subscribe(data => {
			this.preSubmit = false;
			this.mixpanel.track('subscribed', { location: 'getStarted', email: email });
			this.cookieService.set('subscribed', true);
			this.show = false;

			this.notificationsService.success('Thank you!', 'We will let you know when we\'re ready', {
				timeOut: 3000,
				showProgressBar: true,
				pauseOnHover: true,
				clickToClose: true
			});

		});


	}

}
