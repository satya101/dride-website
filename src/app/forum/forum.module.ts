import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ForumModuleStandAlone } from '../forum/forum-stand-alone.module'

import { ForumComponent } from './forum.component';
import { routing } from './forum.routing';
import { SharedModule } from '../helpers/shared.module';
import { TruncateModule } from 'ng2-truncate';



@NgModule({
	imports: [
		routing,
		ForumModuleStandAlone
	]
})
export class ForumModule { }
