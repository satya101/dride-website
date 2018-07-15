import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreComponent } from './store.component';
import { routing } from './store.routing';


@NgModule({
	imports: [routing,
		CommonModule,
	],
	declarations: [StoreComponent]
})
export class StoreModule { }
