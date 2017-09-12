import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';

import { ThreadComponent } from './thread.component';
import { SharedModule } from '../helpers/shared.module';


import { routing } from './thread.routing';

@NgModule({
	imports: [
		SharedModule,
		routing,
		FormsModule,
		CommonModule,
		AngularFireAuthModule,
		AngularFireDatabaseModule,
		MarkdownToHtmlModule
	],
	declarations: [ThreadComponent]
})
export class ThreadModule { }
