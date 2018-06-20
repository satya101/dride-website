import { Injectable } from '@angular/core';

/*
*	This service will help us determine if we're on the server or on the browser
*/

@Injectable({ providedIn: 'root' })
export class SsrService {
	constructor() {}

	isBrowser() {
		return typeof window !== 'undefined';
	}
}
