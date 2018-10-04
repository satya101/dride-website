import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SsrService } from '../../../helpers/ssr/ssr.service';
import { environment } from '../../../../environments/environment';

import { introAnim } from '../../../router.animations';

import { VgAPI } from 'videogular2/core';
import { MixpanelService } from '../../../helpers/mixpanel/mixpanel.service';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [introAnim]
})
export class PlayerComponent {
	@Input()
	currentVideo: any;
	@Input()
	tag: any;
	@Input()
	currentTime = 0;

	public showPlay = true;
	public showReplay = false;
	public total = 0;
	public buffered = 0;
	public played = false;
	public isBrowser = false;
	public api: VgAPI;

	constructor(public ssr: SsrService, private http: HttpClient, public mixpanel: MixpanelService) {
		this.isBrowser = this.ssr.isBrowser();
	}

	ngOnChanges(change) {
		this.currentVideo = null;
		this.showReplay = false;
		this.showPlay = true;
		setTimeout(() => {
			this.currentVideo = this.reformatVideoObjectToLocal(change.currentVideo.currentValue);
		}, 100);
	}

	onPlayerReady(api: VgAPI, video, tag: string = 'Unknown') {
		this.api = api;
		const defaultMedia = api.getDefaultMedia();
		if (!this.ssr.isBrowser()) {
			return;
		}

		defaultMedia.subscriptions.loadStart.subscribe(() => {
			if (api.getDefaultMedia() && this.currentTime) {
				api.getDefaultMedia().currentTime = this.currentTime;
			}
		});

		defaultMedia.subscriptions.playing.subscribe(() => {
			// increase views counter
			if (!this.played && video.key) {
				this.played = true;
				this.http.get(environment.functionsURL + '/viewCounterFS?videoId=' + video.key).subscribe();
			}
			this.mixpanel.track('PlayVideo', { vid: video.key, where: tag });
		});

		defaultMedia.subscriptions.ended.subscribe(d => {
			this.showReplay = true;
		});
		defaultMedia.subscriptions.timeUpdate.subscribe(d => {
			// Set the video to the beginning
			this.currentTime = api.currentTime;
			this.total = api.time.total;
		});
		defaultMedia.subscriptions.progress.subscribe(() => {
			if (api.time.total > 0) {
				this.buffered = (api.buffer.end * 94) / api.time.total;
			}
		});
	}

	play() {
		this.api.play();
		this.showPlay = false;
	}
	rePlay() {
		this.showReplay = false;
		this.play();
	}

	fullScreen() {
		this.api.fsAPI.toggleFullscreen();
		const s = this.api.fsAPI.onChangeFullscreen.subscribe(r => {
			r ? this.play() : this.pause();
			s.unsubscribe();
		});
	}

	pause() {
		this.api.pause();
		this.showPlay = true;
	}

	updateCurrentTime(newTime) {
		if (newTime !== this.currentTime) {
			this.api.currentTime = newTime;
		}
	}

	reformatVideoObjectToLocal(videoUnformatted) {
		try {
			return {
				key: videoUnformatted.videoId,
				id: videoUnformatted.id,
				timestamp: videoUnformatted.timestamp,
				thumb: videoUnformatted.thumbs.src,
				thumbPreloaded: videoUnformatted.thumbs.src,
				clip: videoUnformatted.clips.src,
				cue:
					videoUnformatted.s.length >= 9
						? this.normalizeTimeStamp(videoUnformatted.s) - this.normalizeTimeStamp(videoUnformatted.timestamp)
						: videoUnformatted.s,
				emr: false
			};
		} catch (e) {
			return videoUnformatted;
		}
	}

	normalizeTimeStamp(timestamp) {
		if (!timestamp) {
			return 0;
		}
		for (let i = timestamp.toString().length; i < 13; i++) {
			timestamp += '0';
		}
		return parseInt(timestamp, 10);
	}
}
