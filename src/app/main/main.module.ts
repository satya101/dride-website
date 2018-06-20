import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainComponent } from './main.component';
import { routing } from './main.routing';

import { PlayerModule } from '../layout/components/player/player.module';
import { CloudModuleStandAlone } from '../cloud/cloud-stand-alone.module';
import { ForumModuleStandAlone } from '../forum/forum-stand-alone.module';
import { SharedModule } from '../helpers/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TruncateModule } from 'ng2-truncate';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { InViewport } from '../helpers/in-viewport.directive';

@NgModule({
	imports: [
		routing,
		CommonModule,
		FormsModule,
		PlayerModule,
		InfiniteScrollModule,
		SharedModule,
		TruncateModule,
		ForumModuleStandAlone,
		CloudModuleStandAlone,
		NgxPageScrollModule
	],
	declarations: [MainComponent, InViewport]
})
export class MainModule {}
