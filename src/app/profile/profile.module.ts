import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayerModule } from '../layout/components/player/player.module'
import { SharedModule } from '../helpers/shared.module';
import { environment } from '../../environments/environment';

import { ProfileComponent } from './profile.component';
import { routing } from './profile.routing';
import { AgmCoreModule, AgmPolygon } from '@agm/core';
import { AutosizeModule } from '../helpers/autosize/autosize.module';




@NgModule({
	imports: [routing,
		CommonModule,
		SharedModule,
		FormsModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleMapsApi
		}),
		PlayerModule,
		AutosizeModule
	],
	declarations: [ProfileComponent]
})
export class ProfileModule { }
