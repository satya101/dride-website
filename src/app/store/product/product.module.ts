import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { routing } from './product.routing';

@NgModule({
	imports: [routing,
		CommonModule,
	],
	declarations: [ProductComponent]
})
export class ProductModule { }
