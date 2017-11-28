import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SsrService } from '../../../helpers/ssr/ssr.service'
import { environment } from '../../../../environments/environment';

import { VgAPI } from 'videogular2/core';
import { MixpanelService } from '../../../helpers/mixpanel/mixpanel.service';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PlayerComponent implements OnInit {

	@Input() currentVideo: any;
	@Input() tag: any;
	@Input() currentTime = 0;

	constructor(public ssr: SsrService, private http: HttpClient, public mixpanel: MixpanelService) { }

	ngOnInit() {
		if (!this.currentTime) {
			this.currentTime = 0
		}
	}

	onPlayerReady(api: VgAPI, video, tag: string = 'Unknown') {
		if (!this.ssr.isBrowser()) { return }

		api.getDefaultMedia().subscriptions.loadStart.subscribe(
			() => {
				if (this.currentTime) {
					api.getDefaultMedia().currentTime = this.currentTime;
				}
			}
		)

		api.getDefaultMedia().subscriptions.playing.subscribe(
			() => {
				// increase views counter
				if (video.videoId && video.op) {
					this.http.get(environment.functionsURL + '/viewCounter?videoId=' + video.videoId + '&op=' + video.op).subscribe()
				}

				this.mixpanel.track('PlayVideo', { vid: video.videoId, where: tag })
			}
		);
	}




}
