import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-api',
	templateUrl: './api.component.html',
	styles: []
})
export class ApiComponent implements OnInit {

	public body = `
API
===

The Dride webservices are one such component that provides a predefined
interface for other devices to get/set device information.

Base URL
======
    http://192.168.42.1:9000


Routes
======

| URL                       | Params | Type | Purpose                   |
|---------------------------|------|------|---------------------------|
| **/api/getClips**         |  | GET  | A list of all video clips |
| **/api/getSettings**      |  | GET  | A list of device settings |
| **/api/setSettings**      | CategoryName, fieldName, fieldValue | GET  | Update device setting |
| **/api/deleteClip**       | videoId  | GET  | Delete a video by videoId |
| **/api/deleteAllClips**   |  | GET  | Delete all video clips on deivce |
| **/api/updateFirmware**   |  | GET  | Update device firmawre to the latest version |
| **/api/isOnline**         |  | GET  | Check if device is online |
| **/api/getSerialNumber**  |  | GET  | Return device serial number |
| **/api/indicator**        | action: ["isWaiting", "isDownloading", "isPaired", "needToPair", "needToLogin", "uploadSuccessfully", "done"]  | GET  | Control LED indicator on device |




Static Routes
=============

Static routes offer access to the media: thumbnails and video's for each
clip.

Examples:

* /modules/video/thumb/1515036499325.jpg
* /modules/video/clip/1514850857979.mp4


Accessing the API
=================

First establish connection with your development workstation via WiFi.

<br>
An Example:

This request will return the device serail number

	http://192.168.42.1:9000/api/getSerialNumber

A **curl** example:

	curl http://192.168.42.1:9000/api/getSerialNumber

And output:

	{"serial":"00000000445acdb3"}

`
	constructor() { }

	ngOnInit() {
	}

}
