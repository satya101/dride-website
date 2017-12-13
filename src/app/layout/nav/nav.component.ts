import { Component, OnInit, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { SsrService } from '../../helpers/ssr/ssr.service'

import { introAnim } from '../../router.animations';
import { NotificationsService } from 'angular2-notifications';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	animations: [ introAnim ]

})
export class NavComponent implements OnInit {

	firebaseUser: any;
	isCollapsed = true;
	isFixed = false;
	path = '';
	showOverlay = false;

	constructor(private auth: AuthService,
		private renderer: Renderer,
		public location: Location,
		public router: Router,
		public ssr: SsrService,
		private notificationsService: NotificationsService) {

		if (this.ssr.isBrowser()) {
			router.events.subscribe((val) => {
				this.path = location.path();
				if (this.path !== '') {
					this.isFixed = false;
				} else {
					this.isFixed = true
				}
			});
		}

		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;

		});
	}

	setHeight(el, height) {
		if (!this.isCollapsed) {
			this.renderer.setElementStyle(el, 'height', height + 'px');
		}
	}

	logOut() {
		this.auth.logOut();
		this.notificationsService.success('Success', 'You\'ve been logged out successfully', {
			timeOut: 3000,
			showProgressBar: true,
			pauseOnHover: true,
			clickToClose: true
		});
	}
	ngOnInit() {

	}

	getProfilePic() {
		if (this.firebaseUser.fid) {
			return 'https://graph.facebook.com/' + this.firebaseUser.fid + '/picture';
		}else {
			return this.firebaseUser.photoURL;
		}
	}

}
