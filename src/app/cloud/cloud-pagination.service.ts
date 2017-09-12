import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CloudPaginationService {

	items: Array<any> = [];
	busy = false;
	after = '9999999999999'; // highest key possible
	before = '';
	end = false;
	isFull = true;

	constructor(private http: HttpClient) {
		this.busy = false;
	}

	init(isFull) {
		this.isFull = isFull;
		if (!this.isFull) {
			this.items = [];
			this.busy = false;
			this.end = false;
			this.after = '9999999999999'; // highest key possible
			this.before = '';
		}
		this.nextPage();

	}

	nextPage = function () {

		if (this.busy || (this.isFull && this.end)) {
			return
		};

		this.busy = true;

		const url = environment.firebase.databaseURL +
			'/clips_homepage.json?orderBy=%22hpInsertTime%22&endAt=%22' +
			this.after +
			'%22&limitToLast=' +
			(this.isFull ? 5 : 3)


		this.http
			.get(url)
			.subscribe(data => {

				const items = this.reverseObject(data);
				for (const item in items) {
					if (items.hasOwnProperty(item)) {
						const config = {
							config: {
								preload: 'none',
								sources: [
									{
										src: items[item].clips.src,
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
									poster: items[item].thumbs.src
								}
							}
						};
						Object.assign(items[item], config)

						if (!items[item].comments) {
							items[item].comments = [];
							items[item].loadMore = false;
						}else {
							items[item].loadMore = true;
						}


						this.items.push(items[item]);
						this.after = items[item].hpInsertTime;
					}
				}
				this.busy = false;

				if (this.after === this.before) {
					this.end = true;
					return;
				}

				this.before = this.after;
				// remove last element because he is the first element from next batch
				this.items.pop();

			},
			error => {
				this.end = true
				// TODO: log this
				console.log('An error occurred when requesting cloud clips.');
			}

			)


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
