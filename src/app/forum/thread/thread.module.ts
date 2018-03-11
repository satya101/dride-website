import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { MarkdownModule } from 'ngx-markdown';
import { ThreadComponent } from './thread.component';
import { SharedModule } from '../../helpers/shared.module';
import { AutosizeModule } from '../../helpers/autosize/autosize.module';
import { WrapIframePipe } from '../../helpers/wrapIframePipe/wrap-iframe.pipe';

import { routing } from './thread.routing';
import { ProfilePicConvertorPipe } from './profile-pic-convertor.pipe';

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
