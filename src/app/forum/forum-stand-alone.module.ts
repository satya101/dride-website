import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ForumComponent } from './forum.component';
import { ThreadBlockComponent } from './components/thread-block/thread-block.component';
import { ColorLabelPipe } from './pipes/color-label.pipe';
import { Hit2postPipe } from './pipes/hit2post.pipe';
import { NgbdModalAskInForum } from './askInForum.modal';
import { SharedModule } from '../helpers/shared.module';
import { TruncateModule } from 'ng2-truncate';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgAisModule } from 'angular-instantsearch';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		TruncateModule,
		FormsModule,
		RouterModule,
		InfiniteScrollModule,
		NgAisModule,
		MarkdownModule.forRoot()
	],
	declarations: [ForumComponent, ThreadBlockComponent, ColorLabelPipe, Hit2postPipe],
	exports: [ForumComponent]
})
export class ForumModuleStandAlone {}
