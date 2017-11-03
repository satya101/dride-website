import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CloudComponent } from './cloud.component';
import { CloudPaginationService } from './cloud-pagination.service';

import { PlayerModule } from '../layout/components/player.module'
import { SharedModule } from '../helpers/shared.module';
import { environment } from '../../environments/environment';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutosizeModule } from '../helpers/autosize/autosize.module';


@NgModule({
	imports: [
		PlayerModule,
		CommonModule,
		SharedModule,
		FormsModule,
		InfiniteScrollModule,
		AutosizeModule
	],
	declarations: [CloudComponent],
	providers: [CloudPaginationService],
	exports: [CloudComponent]
})
export class CloudModuleStandAlone { }
