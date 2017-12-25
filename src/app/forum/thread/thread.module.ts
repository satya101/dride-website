import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MarkdownModule } from 'ngx-markdown';
import { ThreadComponent } from './thread.component';
import { SharedModule } from '../../helpers/shared.module';
import { AutosizeModule } from '../../helpers/autosize/autosize.module';
import { WrapIframePipe } from '../../helpers/wrapIframePipe/wrap-iframe.pipe';


import { routing } from './thread.routing';

@NgModule({
	imports: [
		SharedModule,
		routing,
		FormsModule,
		CommonModule,
		AngularFireDatabaseModule,
		MarkdownModule.forRoot(),
		AutosizeModule
	],
	declarations: [ThreadComponent, WrapIframePipe]
})
export class ThreadModule { }
