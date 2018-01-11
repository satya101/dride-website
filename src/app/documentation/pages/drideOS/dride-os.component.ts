import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-dride-os',
	templateUrl: './dride-os.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class DrideOSComponent implements OnInit {
public body = `

drideOS
=======
DrideOS is a specific customization of Raspbian "Jessie" built to run on the Dride & Dride Zero dashcams.  This is a Debian Linux
deriviative hosting common features you would find on any Linux computer.
<br><br>
>There is no desktop/GUI support provided for this device type.

Support is included for these common programming languages/platforms:

* Node JS v8.9.0

* Python 2.7

Intent
======

The goal of drideOS is to build an open alternative for dashcam softwere so it could be easly implemented by both manufectorers and
developers.


drideOS Architecture
===================================

Raspbian has been customized for specific use and named **drideOS**.
The system architecture involves specific kernel modules, daemons,
RESTful API' and watchdogs*' to ensure an always available system with
access from a remote device.



Services
================

* **/etc/init.d/dride-core** - Used for the recording mechanisem
* **/etc/init.d/dride-ws**  -  Providing the web services outlined here: [API](/documentation/api)

Daemons
================

* **/etc/daemons/bluetooth/main.js** - Listner for the BLE powered 'Impluse Button'



Cron Jobs
====

Clean up diskspace removing oldest videos (Every minute):

	$> sudo crontab -l
	* * * * * node /home/Cardigan/modules/video/helpers/cleaner.js



Startup Sequence
================

Following normal system startup procedures boot, kernel modules, etc. DrideOS
initiates the start of the two services.

dride-core
----------

1. Welcome LED
2. Decode clips that weren't decoded yet
3. Start recording
4. Start BLE daemon

dride-ws
----------

1. Start express server to serve the [API](/documentation/api)


Monitoring/Performance
======================

$> htop

<br>
<br>
<br>
<br>
<br>
<br>
<br>
*Watchdogs are a future enhancement*
`;

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'drideOS',
			'Open source dashcam OS'
		)
	}

}
