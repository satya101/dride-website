import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MarkdownModule } from 'ngx-markdown';
import { ThreadComponent } from './thread.component';
import { SharedModule } from '../../helpers/shared.module';
import { AutosizeModule } from '../../helpers/autosize/autosize.module';
import { WrapIframePipe } from '../../helpers/wrapIframePipe/wrap-iframe.pipe';

import { routing } from './thread.routing';
import { ProfilePicConvertorPipe } from '../pipes/profile-pic-convertor.pipe';

@NgModule({
	imports: [
		SharedModule,
		routing,
		FormsModule,
		CommonModule,
		AngularFireDatabaseModule,
		AngularFireStorageModule,
		MarkdownModule.forRoot(),
		AutosizeModule
	],
	declarations: [ThreadComponent, WrapIframePipe, ProfilePicConvertorPipe]
})
export class ThreadModule {}
