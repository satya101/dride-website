import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageZoomModule } from 'angular2-image-zoom';

import { ProductComponent } from './product.component';
import { routing } from './product.routing';

@NgModule({
	imports: [routing,
		CommonModule,
		ImageZoomModule
	],
	declarations: [ProductComponent]
})
export class ProductModule { }
