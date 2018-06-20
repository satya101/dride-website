import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ForumComponent } from './forum.component';
import { NgbdModalAskInForum } from './askInForum.modal';
import { SharedModule } from '../helpers/shared.module';
import { TruncateModule } from 'ng2-truncate';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
	imports: [CommonModule, SharedModule, TruncateModule, FormsModule, RouterModule, InfiniteScrollModule],
	declarations: [ForumComponent],
	exports: [ForumComponent]
})
export class ForumModuleStandAlone {}
