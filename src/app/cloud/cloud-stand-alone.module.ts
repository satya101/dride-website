import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CloudComponent } from './cloud.component';

import { PlayerModule } from '../layout/components/player/player.module';
import { SharedModule } from '../helpers/shared.module';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutosizeModule } from '../helpers/autosize/autosize.module';

@NgModule({
	imports: [PlayerModule, CommonModule, SharedModule, FormsModule, InfiniteScrollModule, AutosizeModule, RouterModule],
	declarations: [CloudComponent],
	exports: [CloudComponent]
})
export class CloudModuleStandAlone {}
