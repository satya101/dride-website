import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch'

import { UploadVideoComponent } from './upload-video.component';
import { routing } from './upload-video.routing';

@NgModule({
	imports: [routing,
		CommonModule,
		FormsModule,
		UiSwitchModule
	],
	declarations: [UploadVideoComponent]
})
export class UploadVideoModule { }
