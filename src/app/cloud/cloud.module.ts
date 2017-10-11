import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CloudModuleStandAlone } from '../cloud/cloud-stand-alone.module'
import { routing } from './cloud.routing';



@NgModule({
	imports: [routing,
		CloudModuleStandAlone
	]
})
export class CloudModule { }
