import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-indicators',
	templateUrl: './indicators.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class IndicatorsComponent implements OnInit {

	public body = `
# INDICATORS

LED Indicators explained

| Description                         | Command       | Color    | Action
|-------------------------------------|---------------|----------------|------------
| Device Start Up			                | welcome       | White  | Fade on/off
| User needs to login    	            | needToLogin   | Yellow | Fade on/off
| Device paired with BLE 	            | isPaired      | White  | Fade on/off
| Device needs to be paired with BLE  | needToPair 	  | Red    | Blink
| Wating for video    	              | isWaiting     | White  | Flash on/off continuous
| Downloading video		                | isDownloading | White  | Flash on/off continuous
| Button pressed while paired         | buttonPress   | White  | White on one time
| Error has been caused 	            | error         | Red    | Blink
| **Clear all**                       | done          | White | Clears any LED activity


You may test/run the LED by executing at command line

	sudo python /home/Cardigan/modules/indicators/python/states/standalone.py <cmd>

`
	
	constructor(private meta: MetaService) {
	}

}
