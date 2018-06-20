import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SsrService } from '../helpers/ssr/ssr.service';

@Injectable({ providedIn: 'root' })
export class CloudPaginationService {
	items: Array<any> = [];
	busy = false;
	after = '9999999999999'; // highest key possible
	before = '';
	end = false;
	isFull = true;
	maxItemsInPage = 5;
	public clipsStack = {};
	constructor(private http: HttpClient, public ssr: SsrService) {
		this.busy = false;
	}

	init(isFull) {
		this.isFull = isFull;
		if (!this.isFull) {
			this.items = [];
			this.busy = false;
			this.end = false;
		}

		// no need to render on server
		if (this.ssr.isBrowser()) {
			this.nextPage();
		}

		const url =
			environment.firebase.databaseURL +
			'/clips_homepage.json?orderBy=%22hpInsertTime%22&endAt=%22' +
			this.after +
			'%22&limitToLast=' +
			(this.isFull ? 50 : 2);

		this.http.get(url).subscribe(
			data => {
				this.clipsStack = this.reverseObject(data);
				this.nextPage();
			},
			error => {
				this.end = true;
				// TODO: log this
				console.log('An error occurred when requesting cloud clips.', error);
			}
		);
	}

	nextPage = function() {
		console.log('next page', this.end, this.busy);
		if (this.busy || (this.isFull && this.end)) {
			return;
		}

		this.busy = true;
		let c = 0;
		for (const item in this.clipsStack) {
			if (this.clipsStack.hasOwnProperty(item)) {
				if (c >= this.maxItemsInPage) {
					this.busy = false;
					return;
				}
				c++;
				const config = {
					config: {
						preload: 'none',
						sources: [
							{
								src: this.clipsStack[item].clips.src,
								type: 'video/mp4'
							}
						],
						theme: {
							url: 'styles/videoPlayer.css'
						},
						plugins: {
							controls: {
								autoHide: true,
								autoHideTime: 5000
							},
							poster: this.clipsStack[item].thumbs.src
						}
					}
				};
				Object.assign(this.clipsStack[item], config);

				if (!this.clipsStack[item].comments) {
					this.clipsStack[item].comments = [];
					this.clipsStack[item].loadMore = false;
				} else {
					this.clipsStack[item].loadMore = true;
				}

				this.items.push(this.clipsStack[item]);
				this.after = this.clipsStack[item].hpInsertTime;

				delete this.clipsStack[item];
			}
		}
		this.busy = false;

		if (!this.clipsStack) {
			this.end = true;
			return;
		}
	};

	reverseObject(object) {
		const newObject = {};
		const keys = [];
		for (const key in object) {
			if (object.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		for (let i = keys.length - 1; i >= 0; i--) {
			const value = object[keys[i]];
			newObject[keys[i]] = value;
		}

		return newObject;
	}
}
