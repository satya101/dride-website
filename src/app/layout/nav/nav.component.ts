import { Component, OnInit, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../user.service';
import { introAnim } from '../../router.animations';

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

	constructor(private afAuth: AngularFireAuth, private renderer: Renderer, public location: Location,  router: Router) {

		router.events.subscribe((val) => {
			this.path = location.path();
			if (this.path !== '') {
				this.isFixed = false;
			} else {
				this.isFixed = true
			}
		});

		afAuth.authState.subscribe(user => {
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
		this.afAuth.auth.signOut();
		// TODO: alert
	}
	ngOnInit() {

	}

}
