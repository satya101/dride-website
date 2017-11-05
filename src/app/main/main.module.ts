import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MainComponent } from './main.component';
import { routing } from './main.routing';

import { PlayerModule } from '../layout/components/player.module'
import { PlayerComponent } from '../layout/components/player.component'
import { CloudModuleStandAlone } from '../cloud/cloud-stand-alone.module'
import { ForumModuleStandAlone } from '../forum/forum-stand-alone.module'
import { SharedModule } from '../helpers/shared.module';
import { environment } from '../../environments/environment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CloudPaginationService } from '../cloud/cloud-pagination.service';
import { TruncateModule } from 'ng2-truncate';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { InViewport } from '../helpers/in-viewport.directive';


@NgModule({
	imports: [routing,
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
	declarations: [MainComponent, InViewport],
	providers: [CloudPaginationService]
})
export class MainModule { }
