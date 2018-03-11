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
| **/api/setSettings**      | fieldName, fieldValue | GET  | Update device setting |
| **/api/deleteClip**       | videoId  | GET  | Delete a video by videoId |
| **/api/deleteAllClips**   |  | GET  | Delete all video clips on deivce |
| **/api/updateFirmware**   |  | GET  | Update device firmawre to the latest version |
| **/api/isOnline**         |  | GET  | Check if device is online |
| **/api/getSerialNumber**  |  | GET  | Return device serial number |
| **/api/indicator**        | action: ["isWaiting", "isDownloading", "isPaired", "needToPair", "needToLogin", "uploadSuccessfully", "done"]  | GET  | Control LED indicator on device |


Settings Parameters
======
| Param                    | Type    | Description   |
|--------------------------|---------|---------------|
| videoRecord              | Boolean | Turn video recording on/off |
| flipVideo                | Boolean | Rotate video 180-degree |
| gps                      | Boolean | Turn GPS on/off|
| speaker                  | Boolean | Turn speaker on/off|
| mic                      | Boolean | Turn mic on/off |
| indicator                | Boolean | Turn indicator LED on/off |
| resolution               | '1080' or '720'  | Set device resolution |
| clipLength              | int | Set cycle length in minutes |
| gSensorSensitivity       | 'off' or 'low' or 'medium' or 'high' | Set GSensor Sensitivity|
| netwrokSSID              | String | Set Wifi netrowrk SSID |
| netwrokPassword          | String | Set Wifi netrowrk password |


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

`;
	constructor() {}

	ngOnInit() {}
}
