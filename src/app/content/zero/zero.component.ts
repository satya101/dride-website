import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { MetaService } from '../../helpers/meta/meta.service'
import { HttpClient } from '@angular/common/http';
import { MixpanelService } from '../../helpers/mixpanel/mixpanel.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
	selector: 'app-zero',
	templateUrl: './zero.component.html',
	styleUrls: ['./zero.component.scss']
})
export class ZeroComponent implements OnInit {

	preSubmit = true
	videoObj = {}

	currentAppFeature = 0;

	featuresObj = [
		{ icon: 'icon-f_angle', title: 'Wide Angle' },
		{ icon: 'icon-f_1080', title: 'Full HD' },
		{ icon: 'icon-f_720', title: '60 FPS' },
		{ icon: 'icon-f_cyclic', title: 'Cyclic Record' },
		{ icon: 'icon-f_cloud2', title: 'Cloud' },
		{ icon: 'icon-f_app', title: 'App' },
		{ icon: 'icon-f_wifi', title: 'Connectivity' },
		{ icon: 'icon-f_crash', title: 'Emergeny Record' },

	]

	appActions = [
		{ icon: 'icon-f_upload', title: 'Upload', video: 'upload', desc: 'Upload and share your videos with just one press of the Dride-Zero impulse button, or use our app to search for specific events, find the footage and share. Yes, it’s really that simple.' },
		{ icon: 'icon-f_share', title: 'Share', video: 'share', desc: 'If sharing is caring then we like to show it with our dashcam’s app that helps keep the roads safer.  With simplified road event video sharing, use just one link and zero heavy file sharing hassles or solutions, as the Dride-cloud both hosts the video for you and makes it easily accessible to the Dride community or your contacts.' },
		{ icon: 'icon-f_cloud', title: 'Cloud', video: 'cloud', desc: 'Everyday, our users learn more about increasing road safety awareness, as our goal to save lives also means a chance for you to watch and comment on road event videos within the Dride community. Our cloud-based social space allows you to connect with drivers like you with hopes for safer roads in sharing their experiences.' },
		{ icon: 'icon-f_settings', title: 'Settings', video: 'settings', desc: 'Managing your device settings with our state of the art Dride app is easy, so adjusting frame rate, video resolution, sharing preferences and other options is fast, efficient and centralized, no fiddling with funny camera buttons required.' }
	]

	constructor(private meta: MetaService,
		private http: HttpClient,
		private mixpanel: MixpanelService,
		private notificationsService: NotificationsService) {
		this.videoObj = {
			videoId: '2017_1102_105829',
			op: 'XAPDVkxxfgfYfCXTLS0MILsfhPY2',
			clips: { 'src': 'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/clips%2FXAPDVkxxfgfYfCXTLS0MILsfhPY2%2F2017_1102_105829.mp4?alt=media&token=e672bea7-f66e-456d-8a9f-8ffeb57cc3d9' },
			thumbs: { 'src': 'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/thumbs%2FXAPDVkxxfgfYfCXTLS0MILsfhPY2%2F2017_1102_105829.jpg?alt=media' }
		}

	}

	ngOnInit() {
		this.meta.set(
			'Features',
			'Dride is the worlds smallest connected dashcam.'
		)
	}

	sendDetails = function (email) {

		if (!email) {
			this.notificationsService.warn('Wrong format', 'Please double check your email address is correct.', {
				timeOut: 3000,
				showProgressBar: true,
				pauseOnHover: true,
				clickToClose: true
			});
		} else {
			// subscribe users
			const url = environment.functionsURL + '/subscriber?email=' + email;
			this.http.get(url).subscribe(data => {
				this.preSubmit = false;
				this.mixpanel.track('subscribed', { location: 'Zero', email: email });
			});
		}

	}

}
