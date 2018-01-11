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
	ssh pi@192.168.42.1

* Your Dride may access the internet via the host development PC

> This requires disassembly of the [Dride Zero](/features).

Edit the config.txt file with

    sudo nano /boot/config.txt


Go to the end of the file and add the following:

	dtoverlay=dwc2

Edit the cmdline.txt file with
	sudo nano /boot/config.txt


Go to the end of the file and add the following:

	modules-load=dwc2,g_ether



It **MUST** be added *after* the *rootwait* as shown here::

	dwc_otg.lpm_enable=0 console=serial0,115200 console=tty1 root=PARTUUID=b62737d7-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait modules-load=dwc2,g_ether


> You must not include extra spaces, or new line characters. Failure to do this	wrong **may** prevent your device from booting.

>If your device fails to boot due to an issue caused by editing these files - simply
remove the card and rewrite the Dride OS image.



Install your public SSH key
---------------------------

Install your public SSH key to allow you to more easily remotely connect via SSH::

	ssh-copy-id -i ~/.ssh/id_rsa.pub pi@raspberrypi.local


`
	constructor() { }

	ngOnInit() {
	}

}
