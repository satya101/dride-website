import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-hacking',
	templateUrl: './hacking.component.html',
	styles: []
})
export class HackingComponent implements OnInit {
	public body = `
Hacking
=======

This page contains some useful information to get you started

SSH over Wifi
-------------------
The easiest way to ssh into your Dride is by using Wifi, Since Dride acts as a hotspot it will be availble right after boot.

	ssh pi@192.168.42.1

> default password is **raspberry**


<br><br><br>

Enable SSH over USB
-------------------

You can plug your USB cable from your development computer into the **USB**
port of the device.  This is **not** the same USB port accessible via the device.

Benefits:

* Directly SSH into your Dride, example:
	ssh pi@raspberrypi.local

* Your Dride may access the internet via the host development PC

> This requires disassembly of the [Dride Zero](/features).

`;
	constructor() {}

	ngOnInit() {}
}
