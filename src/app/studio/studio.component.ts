import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { AuthService } from '../auth.service';
import { NotificationsService } from 'angular2-notifications';
import { AngularFirestore } from 'angularfire2/firestore';
import { MetaService } from '../helpers/meta/meta.service';

@Component({
	selector: 'app-studio',
	templateUrl: './studio.component.html',
	styleUrls: ['./studio.component.scss']
})
export class StudioComponent implements OnInit {
	public firebaseUser: any;
	public video: any;
	public videoId: string;
	public description: string;

	constructor(
		private auth: AuthService,
		public db: AngularFirestore,
		private notificationsService: NotificationsService,
		private meta: MetaService,
		private route: ActivatedRoute,
		private router: Router
	) {
		auth.getState().subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
				return;
			}
			this.firebaseUser = user;
		});
	}

	ngOnInit() {
		this.meta.set('Studio', 'Edit video');
		this.route.params.subscribe(params => {
			this.videoId = params.vid;
			this.auth.verifyLoggedIn().then(res => {
				this.db
					.collection('clips')
					.doc(params.vid)
					.valueChanges()
					.subscribe((snapshot: any) => {
						this.video = snapshot;
						this.description = snapshot ? snapshot.description : '';
					});
			});
		});
	}

	save() {
		this.db
			.collection('clips')
			.doc(this.videoId)
			.update({ description: this.description })
			.then(() => {
				this.notificationsService.success('Beep Beep', 'Your video was updated successfully', {
					timeOut: 3000,
					showProgressBar: true,
					pauseOnHover: true,
					clickToClose: true
				});
				this.router.navigateByUrl('/profile/' + this.firebaseUser.uid + '/' + this.videoId);
			});
	}
}
