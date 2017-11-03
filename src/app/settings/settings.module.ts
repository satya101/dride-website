import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch'

import { SettingsComponent } from './settings.component';
import { routing } from './settings.routing';

@NgModule({
	imports: [routing,
		CommonModule,
		FormsModule,
		UiSwitchModule
	],
	declarations: [SettingsComponent]
})
export class SettingsModule { }
