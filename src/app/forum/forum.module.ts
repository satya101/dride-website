import { NgModule } from '@angular/core';

import { ForumModuleStandAlone } from '../forum/forum-stand-alone.module';

import { routing } from './forum.routing';

import { NgAisModule } from 'angular-instantsearch';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
	imports: [routing, ForumModuleStandAlone, NgAisModule, InfiniteScrollModule]
})
export class ForumModule {}
