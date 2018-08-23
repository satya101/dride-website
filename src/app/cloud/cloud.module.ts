import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { CloudModuleStandAlone } from '../cloud/cloud-stand-alone.module';
import { routing } from './cloud.routing';

@NgModule({
	imports: [routing, CloudModuleStandAlone, RouterModule]
})
export class CloudModule {}
